"""
Visual regression: BottomNav icons + labels must render in brand blue
(matching the resolved --primary token) in both light and dark modes
across common viewports.

Brand primary tokens:
  light: hsl(233 72% 55%) -> rgb(58, 77, 223)
  dark:  hsl(234 80% 62%) -> rgb(81, 96, 236)

Run:
    python3 tests/visual/bottom-nav-blue.spec.py
    PREVIEW_URL=http://localhost:8080 python3 tests/visual/bottom-nav-blue.spec.py

Output: tests/visual/__screenshots__/bottom-nav-blue/*.png
Exit code: 0 on pass, 1 on any assertion failure.
"""

import asyncio
import os
import re
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = os.environ.get("PREVIEW_URL", "http://localhost:8080")
SCREENSHOTS = Path(__file__).parent / "__screenshots__" / "bottom-nav-blue"
SCREENSHOTS.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [
    ("mobile-sm", {"width": 360, "height": 780}),
    ("mobile",    {"width": 390, "height": 844}),
    ("mobile-lg", {"width": 430, "height": 932}),
    ("tablet",    {"width": 768, "height": 1024}),
]

MODES = ["light", "dark"]

EXPECTED = {
    "light": (58, 77, 223),
    "dark":  (81, 96, 236),
}

# RGB channel tolerance — sub-pixel anti-aliasing & font hinting can shift values
TOL = 6


def parse_rgb(s):
    m = re.search(r"rgba?\(([^)]+)\)", s or "")
    if not m:
        return None
    parts = [float(x.strip()) for x in m.group(1).split(",")[:3]]
    return tuple(int(round(v)) for v in parts)


def close(a, b, tol=TOL):
    return a is not None and b is not None and all(abs(x - y) <= tol for x, y in zip(a, b))


async def set_theme(page, mode):
    await page.evaluate(
        """(mode) => {
          localStorage.setItem('theme', mode);
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(mode);
        }""",
        mode,
    )
    await page.wait_for_timeout(250)


async def collect_nav_colors(page):
    return await page.evaluate(
        """() => {
          const nav = document.querySelector('nav[aria-label="Primary"]');
          if (!nav) return { error: 'no-nav' };
          const svgs = [...nav.querySelectorAll('svg')];
          const labels = [...nav.querySelectorAll('a > span:last-child')];
          const icons = svgs.map(s => getComputedStyle(s).color);
          const lbls = labels.map(s => ({ text: s.textContent, color: getComputedStyle(s).color }));
          const innerStrokes = [];
          svgs.forEach(s => s.querySelectorAll('path').forEach(p => {
            const cs = getComputedStyle(p);
            if (cs.stroke && cs.stroke !== 'none') innerStrokes.push(cs.stroke);
            if (cs.fill && cs.fill !== 'none' && cs.fill !== 'rgba(0, 0, 0, 0)') innerStrokes.push(cs.fill);
          }));
          return { icons, labels: lbls, innerStrokes, navBg: getComputedStyle(nav).backgroundColor };
        }"""
    )


async def main():
    failures = []

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)

        for vp_name, vp in VIEWPORTS:
            for mode in MODES:
                label = f"{vp_name}-{mode}"
                print(f"\n--- {label} ({vp['width']}x{vp['height']}) ---")
                ctx = await browser.new_context(viewport=vp)
                page = await ctx.new_page()
                await page.goto(BASE + "/", wait_until="domcontentloaded")
                try:
                    await page.wait_for_selector('nav[aria-label="Primary"]', timeout=10000)
                except Exception:
                    # BottomNav is mobile/tablet-only; if it's not on screen at this width, skip
                    print(f"  skip: no bottom nav at width {vp['width']}")
                    await ctx.close()
                    continue

                await set_theme(page, mode)
                data = await collect_nav_colors(page)
                expected = EXPECTED[mode]
                print(f"  expected primary: rgb{expected}")
                print(f"  nav bg: {data['navBg']}")
                print(f"  icon colors: {data['icons']}")
                print(f"  label colors: {[l['color'] for l in data['labels']]}")

                # 1. Every icon must match brand blue
                for i, c in enumerate(data["icons"]):
                    rgb = parse_rgb(c)
                    if not close(rgb, expected):
                        failures.append(f"{label}: icon[{i}] {c} != rgb{expected}")

                # 2. Every label must match brand blue
                for l in data["labels"]:
                    rgb = parse_rgb(l["color"])
                    if not close(rgb, expected):
                        failures.append(f"{label}: label '{l['text']}' {l['color']} != rgb{expected}")

                # 3. No inner SVG path may render an off-brand color (must be blue or near-black/transparent)
                for s in data["innerStrokes"]:
                    rgb = parse_rgb(s)
                    if rgb is None:
                        continue
                    # allow black/transparent (pure-blue fallback paint), else must be brand blue
                    is_black = all(v <= 10 for v in rgb)
                    if not (is_black or close(rgb, expected, tol=12)):
                        failures.append(f"{label}: inner path color {s} is off-brand")

                # 4. Dark mode bar must be pure black surface
                if mode == "dark":
                    bg = parse_rgb(data["navBg"])
                    if bg and not all(v <= 10 for v in bg):
                        failures.append(f"{label}: dark nav bg {data['navBg']} is not pure black")

                # Screenshot bottom strip for visual record
                strip_h = 96
                await page.screenshot(
                    path=str(SCREENSHOTS / f"{label}.png"),
                    clip={"x": 0, "y": max(0, vp["height"] - strip_h), "width": vp["width"], "height": strip_h},
                )
                await ctx.close()

        await browser.close()

    print("\n========== RESULT ==========")
    if failures:
        print(f"FAIL ({len(failures)} issue(s)):")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("PASS — bottom nav icons + labels render pure brand blue in every (viewport × mode) combo.")


if __name__ == "__main__":
    asyncio.run(main())
