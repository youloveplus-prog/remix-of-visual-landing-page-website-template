"""
Visual regression test for the homepage layout — guards card order and
spacing so future edits can't silently drift the editorial flow.

Asserts per breakpoint:
  - all expected top-level sections are present, visible, and in the
    exact documented order (#cover -> #trust -> #feature-story ->
    #departments -> #back-matter)
  - vertical spacing between adjacent sections sits in a sane band
    (>= 24px gap, no overlap)
  - inside #departments, the four Department blocks render in order:
    Library, Workshop, Community, Mentorship
  - no section overflows the viewport horizontally
  - a clipped screenshot of each section is saved for pixel-diffing
    via tests/visual/diff.py

Run:
    python3 tests/visual/homepage-layout.spec.py
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("PREVIEW_URL", "http://localhost:8080")
ROUTE = "/"
OUT = Path(__file__).parent / "__screenshots__" / "homepage-layout"
OUT.mkdir(parents=True, exist_ok=True)

# (name, width, height)
BREAKPOINTS = [
    ("xs", 375, 1800),
    ("md", 768, 1800),
    ("lg", 1280, 1800),
]

EXPECTED_SECTIONS = ["cover", "trust", "feature-story", "departments", "back-matter"]
EXPECTED_DEPARTMENTS = ["Library", "Workshop", "Community", "Mentorship"]

MIN_GAP_PX = 24
MAX_GAP_PX = 600  # huge but finite — catches accidental 2000px voids


async def measure(page):
    return await page.evaluate(
        f"""
        () => {{
          const ids = {json.dumps(EXPECTED_SECTIONS)};
          const sections = ids.map(id => {{
            const el = document.getElementById(id);
            if (!el) return {{ id, found: false }};
            const r = el.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            return {{
              id, found: true,
              top: Math.round(r.top + scrollY),
              bottom: Math.round(r.bottom + scrollY),
              left: Math.round(r.left),
              right: Math.round(r.right),
              height: Math.round(r.height),
            }};
          }});
          const deptNames = Array.from(
            document.querySelectorAll('#departments [data-department-name]')
          ).map(n => n.getAttribute('data-department-name'));
          return {{ sections, deptNames, vw: window.innerWidth }};
        }}
        """
    )


async def run():
    failures = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        sk = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
        sj = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")

        for name, width, height in BREAKPOINTS:
            ctx = await browser.new_context(viewport={"width": width, "height": height})
            page = await ctx.new_page()
            await page.goto(BASE_URL, wait_until="domcontentloaded")
            if sk and sj:
                await page.evaluate(
                    f"window.localStorage.setItem({json.dumps(sk)}, {json.dumps(sj)})"
                )
            await page.goto(f"{BASE_URL}{ROUTE}", wait_until="networkidle")

            try:
                await page.wait_for_selector("#cover", timeout=8000)
                await page.wait_for_selector("#back-matter", timeout=8000)
            except Exception:
                failures.append(f"[{name} @ {width}px] homepage sections never mounted")
                await ctx.close()
                continue

            # Force lazy chunks to mount so the layout is stable before measuring.
            await page.evaluate(
                "() => new Promise(r => { window.scrollTo(0, document.body.scrollHeight); setTimeout(r, 400); })"
            )
            await page.evaluate(
                "() => new Promise(r => { window.scrollTo(0, 0); setTimeout(r, 400); })"
            )

            m = await measure(page)

            # 1. presence + order
            found_ids = [s["id"] for s in m["sections"] if s.get("found")]
            if found_ids != EXPECTED_SECTIONS:
                failures.append(
                    f"[{name} @ {width}px] section order/presence drift: "
                    f"got {found_ids}, expected {EXPECTED_SECTIONS}"
                )

            # 2. vertical ordering + gap sanity
            visible = [s for s in m["sections"] if s.get("found")]
            for prev, nxt in zip(visible, visible[1:]):
                gap = nxt["top"] - prev["bottom"]
                if nxt["top"] < prev["top"]:
                    failures.append(
                        f"[{name} @ {width}px] '{nxt['id']}' renders above '{prev['id']}'"
                    )
                if gap < -2:
                    failures.append(
                        f"[{name} @ {width}px] '{prev['id']}' overlaps '{nxt['id']}' (gap={gap}px)"
                    )
                elif gap < MIN_GAP_PX:
                    failures.append(
                        f"[{name} @ {width}px] '{prev['id']}'→'{nxt['id']}' gap too tight ({gap}px < {MIN_GAP_PX})"
                    )
                elif gap > MAX_GAP_PX:
                    failures.append(
                        f"[{name} @ {width}px] '{prev['id']}'→'{nxt['id']}' gap too large ({gap}px > {MAX_GAP_PX})"
                    )

            # 3. no horizontal overflow
            for s in visible:
                if s["left"] < -1 or s["right"] > width + 1:
                    failures.append(
                        f"[{name} @ {width}px] '{s['id']}' overflows viewport "
                        f"(left={s['left']} right={s['right']} vw={width})"
                    )

            # 4. department order (data-department-name set by Department component)
            if m["deptNames"]:
                if m["deptNames"] != EXPECTED_DEPARTMENTS:
                    failures.append(
                        f"[{name} @ {width}px] department order drift: "
                        f"got {m['deptNames']}, expected {EXPECTED_DEPARTMENTS}"
                    )
            else:
                failures.append(
                    f"[{name} @ {width}px] no Department blocks found — add data-department-name to <Department>"
                )

            # 5. per-section clipped screenshots for pixel diffing
            for sid in EXPECTED_SECTIONS:
                el = await page.query_selector(f"#{sid}")
                if not el:
                    continue
                await el.scroll_into_view_if_needed()
                await page.wait_for_timeout(250)
                shot = OUT / f"{name}_{width}_{sid}.png"
                try:
                    await el.screenshot(path=str(shot))
                except Exception as e:
                    failures.append(f"[{name} @ {width}px] failed to screenshot #{sid}: {e}")

            print(
                f"[{name} @ {width}px] sections={found_ids} departments={m['deptNames']}"
            )
            await ctx.close()

        await browser.close()

    if failures:
        print("\nFAIL — homepage layout regressions:")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("\nPASS — homepage layout is stable across all breakpoints.")


if __name__ == "__main__":
    asyncio.run(run())
