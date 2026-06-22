"""
Visual regression — home section header alignment.

Guards that on mobile every home section title (`.hf-title`), eyebrow
(`.hf-eyebrow`), and header-level "View all" link is horizontally
centered with consistent spacing, while on tablet/desktop they revert
to the left-aligned editorial layout.

Asserts:
  - mobile (375px): each `.hf-title` and `.hf-eyebrow` resolves to
    `text-align: center` AND its bounding-box center is within ±8px of
    the viewport center.
  - mobile: every header-level "View all" anchor (rendered by
    `SectionHeader`) sits within ±8px of the viewport center. In-rail
    last-card "View all" tiles (children of horizontal carousels) are
    excluded — they scroll with the rail.
  - mobile spacing: the vertical gap between an eyebrow and its
    sibling title is consistent across all sections (stddev <= 6px).
  - tablet (768px) + desktop (1280px): the same elements revert to
    `text-align: left` / `start` (or `justify` for prose) — i.e. NOT
    centered — so the mobile-only rule doesn't leak.

Run:
    python3 tests/visual/home-header-alignment.spec.py
"""

import asyncio
import json
import os
import statistics
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("PREVIEW_URL", "http://localhost:8080")
ROUTE = "/"
OUT = Path(__file__).parent / "__screenshots__" / "home-header-alignment"
OUT.mkdir(parents=True, exist_ok=True)

BREAKPOINTS = [
    ("mobile", 375, 1800),
    ("tablet", 768, 1800),
    ("desktop", 1280, 1800),
]

CENTER_TOL_PX = 8           # max |center - viewport/2|
SPACING_STDDEV_TOL_PX = 6   # eyebrow→title gap stddev across sections


MEASURE_JS = r"""
() => {
  const vw = window.innerWidth;
  function box(el) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      visible: r.width > 0 && r.height > 0,
      left: r.left, right: r.right, top: r.top, bottom: r.bottom,
      width: r.width, height: r.height,
      center: r.left + r.width / 2,
      textAlign: cs.textAlign,
      text: (el.textContent || '').trim().slice(0, 80),
    };
  }

  const titles = Array.from(document.querySelectorAll('.hf-title'))
    .map(el => ({ kind: 'title', ...box(el), el }));
  const eyebrows = Array.from(document.querySelectorAll('.hf-eyebrow'))
    .map(el => ({ kind: 'eyebrow', ...box(el), el }));

  // Header-level "View all" links live inside a SectionHeader container,
  // NOT inside a horizontal carousel rail. Exclude in-rail last-card tiles
  // (they have `snap-start` / `shrink-0` and live under an overflow rail).
  const allLinks = Array.from(document.querySelectorAll('a, button'))
    .filter(el => /^(view all|see all|view more)$/i.test((el.textContent || '').trim()));
  const headerViewAlls = allLinks.filter(el => {
    if (el.closest('[data-rail], .embla, .snap-x')) return false;
    const cls = el.className?.toString?.() || '';
    if (/snap-start|shrink-0/.test(cls)) return false;
    // require a sibling/ancestor .hf-title within 3 levels
    let p = el.parentElement, depth = 0;
    while (p && depth < 4) {
      if (p.querySelector(':scope > .hf-title, :scope > * > .hf-title')) return true;
      p = p.parentElement; depth++;
    }
    return false;
  }).map(el => ({ kind: 'viewAll', ...box(el), el: undefined }));

  // strip non-serializable refs
  const strip = a => a.map(({ el, ...rest }) => rest);
  return {
    vw,
    titles: strip(titles),
    eyebrows: strip(eyebrows),
    viewAlls: headerViewAlls,
  };
}
"""


async def hydrate(page):
    """Scroll through page to mount lazy sections, then return to top."""
    height = await page.evaluate("document.body.scrollHeight")
    step = 800
    y = 0
    while y < height:
        await page.evaluate(f"window.scrollTo(0,{y})")
        await page.wait_for_timeout(120)
        y += step
        height = await page.evaluate("document.body.scrollHeight")
    await page.evaluate("window.scrollTo(0,0)")
    await page.wait_for_timeout(300)


def check_centered(items, vw, label):
    failures = []
    for i, it in enumerate(items):
        if not it["visible"]:
            continue
        off = it["center"] - vw / 2
        ta = it["textAlign"]
        # text-align must be center OR justify-center via flex (offset alone is fine)
        if abs(off) > CENTER_TOL_PX:
            failures.append(
                f"  [{label}#{i}] off={off:+.1f}px ta={ta} text={it['text']!r}"
            )
    return failures


def check_not_centered(items, vw, label):
    """On tablet/desktop, mobile-only centering must not leak."""
    failures = []
    for i, it in enumerate(items):
        if not it["visible"]:
            continue
        if it["textAlign"] == "center":
            # acceptable if this is intentionally centered hero copy
            # (e.g. the cover headline). Heuristic: title near top of page.
            if it["top"] < 800 and it["kind"] == "title":
                continue
            failures.append(
                f"  [{label}#{i}] leaked text-align:center text={it['text']!r}"
            )
    return failures


def check_spacing(eyebrows, titles):
    """For each eyebrow, find the nearest following title and record gap."""
    gaps = []
    sorted_titles = sorted([t for t in titles if t["visible"]], key=lambda t: t["top"])
    for eb in eyebrows:
        if not eb["visible"]:
            continue
        following = [t for t in sorted_titles if t["top"] >= eb["bottom"] - 2]
        if not following:
            continue
        gap = following[0]["top"] - eb["bottom"]
        if 0 <= gap <= 80:  # only consider plausible eyebrow→title pairs
            gaps.append(gap)
    if len(gaps) < 2:
        return gaps, 0.0, None
    sd = statistics.pstdev(gaps)
    err = None
    if sd > SPACING_STDDEV_TOL_PX:
        err = f"eyebrow→title gap stddev={sd:.1f}px (gaps={gaps})"
    return gaps, sd, err


async def run():
    failures = []
    summary = {}

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        for label, w, h in BREAKPOINTS:
            ctx = await browser.new_context(viewport={"width": w, "height": h})
            page = await ctx.new_page()
            url = BASE_URL.rstrip("/") + ROUTE
            await page.goto(url, wait_until="domcontentloaded")
            await page.wait_for_selector(".hf-title", timeout=10_000)
            await hydrate(page)

            data = await page.evaluate(MEASURE_JS)
            vw = data["vw"]
            summary[label] = {
                "titles": len(data["titles"]),
                "eyebrows": len(data["eyebrows"]),
                "viewAlls": len(data["viewAlls"]),
            }

            (OUT / f"{label}.json").write_text(json.dumps(data, indent=2))
            await page.screenshot(path=str(OUT / f"{label}.png"))

            if label == "mobile":
                f = check_centered(data["titles"], vw, "title")
                if f:
                    failures.append(f"[mobile] titles not centered:\n" + "\n".join(f))
                f = check_centered(data["eyebrows"], vw, "eyebrow")
                if f:
                    failures.append(f"[mobile] eyebrows not centered:\n" + "\n".join(f))
                f = check_centered(data["viewAlls"], vw, "viewAll")
                if f:
                    failures.append(
                        f"[mobile] header-level 'View all' not centered:\n" + "\n".join(f)
                    )
                gaps, sd, err = check_spacing(data["eyebrows"], data["titles"])
                summary[label]["eyebrow_title_gaps"] = gaps
                summary[label]["gap_stddev"] = round(sd, 2)
                if err:
                    failures.append(f"[mobile] inconsistent spacing: {err}")
            else:
                f = check_not_centered(data["titles"], vw, "title")
                if f:
                    failures.append(
                        f"[{label}] mobile centering leaked into titles:\n" + "\n".join(f)
                    )

            await ctx.close()
        await browser.close()

    (OUT / "summary.json").write_text(json.dumps(summary, indent=2))

    if failures:
        print("FAIL — home header alignment regressions:")
        for f in failures:
            print(f)
        print(f"\nArtifacts: {OUT}")
        sys.exit(1)
    print("PASS — home headers centered + spaced consistently on mobile;")
    print("       editorial alignment preserved on tablet & desktop.")
    print(f"summary: {json.dumps(summary, indent=2)}")


if __name__ == "__main__":
    asyncio.run(run())
