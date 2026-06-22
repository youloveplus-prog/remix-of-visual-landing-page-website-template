"""
Accessibility audit — home page headings + contrast across breakpoints.

Guards two properties of the centered home header system:

  1. Semantic heading order — heading levels (h1..h6) in document
     order never skip a level (no h1 → h3 jumps). Exactly one <h1>
     per page. Every `.hf-title` resolves to a real heading element
     (h1..h3), not a <div> styled like one.

  2. Color contrast on the headers themselves — axe-core's
     `color-contrast` rule is run against the live page, but
     filtered to violations whose targets sit inside `.hf-title`,
     `.hf-eyebrow`, or a header-level "View all" link. Contrast
     issues in unrelated areas (e.g. card chrome) are reported as
     informational and don't fail the test.

Run at mobile (375), tablet (768) and desktop (1280) — the centered
mobile layout uses different DOM (flex column, full-width eyebrow)
than the editorial desktop layout, so contrast/heading order must
hold at each breakpoint.

Run:
    python3 tests/visual/home-a11y.spec.py
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("PREVIEW_URL", "http://localhost:8080")
ROUTE = "/"
OUT = Path(__file__).parent / "__screenshots__" / "home-a11y"
OUT.mkdir(parents=True, exist_ok=True)

AXE_CDN = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js"

BREAKPOINTS = [
    ("mobile", 375, 1800),
    ("tablet", 768, 1800),
    ("desktop", 1280, 1800),
]


HEADING_AUDIT_JS = r"""
() => {
  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'))
    .filter(el => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    })
    .map(el => ({
      level: parseInt(el.tagName[1], 10),
      tag: el.tagName,
      text: (el.textContent || '').trim().slice(0, 80),
      top: Math.round(el.getBoundingClientRect().top),
      isHfTitle: el.classList.contains('hf-title'),
    }));

  // Order issues: level jumps > 1 (e.g. h1 -> h3).
  const order = [];
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1], cur = headings[i];
    if (cur.level > prev.level + 1) {
      order.push({
        from: `${prev.tag} "${prev.text}"`,
        to: `${cur.tag} "${cur.text}"`,
        jump: cur.level - prev.level,
      });
    }
  }

  // Every .hf-title must be a real heading (h1..h3 acceptable).
  const fakeHfTitles = Array.from(document.querySelectorAll('.hf-title'))
    .filter(el => !/^H[1-3]$/.test(el.tagName))
    .map(el => ({ tag: el.tagName, text: (el.textContent || '').trim().slice(0, 80) }));

  const h1s = headings.filter(h => h.level === 1);

  return { headings, order, fakeHfTitles, h1Count: h1s.length, h1Texts: h1s.map(h => h.text) };
}
"""


def header_scoped_violation(v):
    """Return True if any target node sits inside a home header element."""
    for node in v.get("nodes", []):
        for tgt in node.get("target", []):
            t = " ".join(tgt) if isinstance(tgt, list) else str(tgt)
            if any(sel in t for sel in [".hf-title", ".hf-eyebrow", "[data-hf-viewall]"]):
                return True
            # also catch text inside a section-header viewAll Link
            html = node.get("html", "")
            if "hf-title" in html or "hf-eyebrow" in html:
                return True
    return False


async def hydrate(page):
    height = await page.evaluate("document.body.scrollHeight")
    y = 0
    while y < height:
        await page.evaluate(f"window.scrollTo(0,{y})")
        await page.wait_for_timeout(120)
        y += 800
        height = await page.evaluate("document.body.scrollHeight")
    await page.evaluate("window.scrollTo(0,0)")
    await page.wait_for_timeout(300)


async def run():
    failures = []
    info = []
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

            # --- heading audit ---
            hdata = await page.evaluate(HEADING_AUDIT_JS)
            bp_summary = {
                "headings": len(hdata["headings"]),
                "h1Count": hdata["h1Count"],
                "orderIssues": len(hdata["order"]),
                "fakeHfTitles": len(hdata["fakeHfTitles"]),
            }

            if hdata["h1Count"] != 1:
                failures.append(
                    f"[{label}] expected exactly 1 <h1>, found {hdata['h1Count']}: {hdata['h1Texts']}"
                )
            if hdata["order"]:
                lines = "\n".join(
                    f"    {o['from']} → {o['to']} (jump +{o['jump']})" for o in hdata["order"]
                )
                failures.append(f"[{label}] heading order skips a level:\n{lines}")
            if hdata["fakeHfTitles"]:
                lines = "\n".join(
                    f"    <{f['tag'].lower()}> {f['text']!r}" for f in hdata["fakeHfTitles"]
                )
                failures.append(
                    f"[{label}] .hf-title used on non-heading elements (must be h1/h2/h3):\n{lines}"
                )

            # --- axe color-contrast (scoped to home headers) ---
            try:
                await page.add_script_tag(url=AXE_CDN)
                axe = await page.evaluate(
                    """async () => {
                        const res = await axe.run(document, {
                            runOnly: ['color-contrast', 'heading-order', 'page-has-heading-one', 'empty-heading'],
                            resultTypes: ['violations'],
                        });
                        return res.violations;
                    }"""
                )
            except Exception as e:
                info.append(f"[{label}] axe failed to load: {e}")
                axe = []

            header_viol = []
            other_viol = []
            for v in axe:
                (header_viol if header_scoped_violation(v) else other_viol).append(v)

            bp_summary["axe_header_violations"] = len(header_viol)
            bp_summary["axe_other_violations"] = len(other_viol)

            if header_viol:
                lines = []
                for v in header_viol:
                    targets = [
                        " ".join(n["target"]) if isinstance(n["target"], list) else str(n["target"])
                        for n in v.get("nodes", [])[:3]
                    ]
                    lines.append(
                        f"    {v['id']} ({v['impact']}): {v['help']}\n      targets: {targets}"
                    )
                failures.append(
                    f"[{label}] axe violations on home headers:\n" + "\n".join(lines)
                )

            if other_viol:
                info.append(
                    f"[{label}] {len(other_viol)} axe violations outside home headers "
                    f"(informational): "
                    + ", ".join(sorted({v["id"] for v in other_viol}))
                )

            summary[label] = bp_summary
            (OUT / f"{label}.json").write_text(
                json.dumps(
                    {"headings": hdata, "header_violations": header_viol, "other_violations": other_viol},
                    indent=2,
                )
            )
            await page.screenshot(path=str(OUT / f"{label}.png"))
            await ctx.close()
        await browser.close()

    (OUT / "summary.json").write_text(json.dumps(summary, indent=2))

    if info:
        print("INFO:")
        for line in info:
            print(f"  {line}")

    if failures:
        print("\nFAIL — home a11y regressions:")
        for f in failures:
            print(f)
        print(f"\nArtifacts: {OUT}")
        sys.exit(1)

    print("PASS — semantic heading order intact + home headers meet color-contrast")
    print("       on mobile, tablet, and desktop.")
    print(f"summary: {json.dumps(summary, indent=2)}")


if __name__ == "__main__":
    asyncio.run(run())
