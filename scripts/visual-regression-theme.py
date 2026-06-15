#!/usr/bin/env python3
"""
Visual regression workflow: render key pages in light and dark modes,
then flag panel-like elements whose dark-mode background isn't near pure black.

Usage:
  python3 scripts/visual-regression-theme.py [--base http://localhost:8080]

Outputs PNGs and a JSON report under scripts/visual-regression-out/.
Exits non-zero if any panel mismatches are found in dark mode.
"""
import asyncio, json, os, sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = "http://localhost:8080"
for i, a in enumerate(sys.argv):
    if a == "--base" and i + 1 < len(sys.argv):
        BASE = sys.argv[i + 1]

ROUTES = ["/", "/shop", "/community", "/courses", "/mentorship", "/profile", "/auth"]
OUT = Path(__file__).parent / "visual-regression-out"
OUT.mkdir(exist_ok=True)

# Pixel tolerance: anything brighter than this in dark mode is a mismatch.
# Pure black = (0,0,0). We allow a tiny margin for AA/shadow noise.
DARK_MAX_CHANNEL = 24  # ~ #181818

# Skim-sample panel-like elements: large rounded containers, cards, sections.
PANEL_SELECTOR = (
    "main, section, [data-panel], .surface-panel, .surface-panel-soft, "
    "[class*='rounded-3xl'], [class*='rounded-2xl']"
)

EVAL_PANELS = """
(args) => {
  const [selector, maxChannel] = args;
  const out = [];
  const els = document.querySelectorAll(selector);
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width < 120 || r.height < 80) continue; // ignore tiny chips
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor; // "rgba(r, g, b, a)" or "rgb(...)"
    const m = bg.match(/rgba?\\(([^)]+)\\)/);
    if (!m) continue;
    const parts = m[1].split(',').map(s => parseFloat(s.trim()));
    const [rr, gg, bb, aa = 1] = parts;
    if (aa < 0.5) continue; // transparent — inherits from parent
    const maxC = Math.max(rr, gg, bb);
    if (maxC > maxChannel) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute('class') || '').slice(0, 120),
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        bg, maxChannel: maxC,
      });
    }
  }
  return out;
}
"""

async def set_theme(page, theme):
    await page.evaluate(
        "(t) => { localStorage.setItem('theme', t); "
        "document.documentElement.classList.toggle('dark', t === 'dark'); "
        "document.documentElement.classList.toggle('light', t === 'light'); }",
        theme,
    )

async def main():
    report = {"base": BASE, "routes": [], "mismatches": 0}
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await ctx.new_page()

        # Establish origin so localStorage writes stick.
        await page.goto(BASE, wait_until="domcontentloaded")

        for route in ROUTES:
            entry = {"route": route, "light": {}, "dark": {}}
            for theme in ("light", "dark"):
                await set_theme(page, theme)
                try:
                    await page.goto(BASE + route, wait_until="networkidle", timeout=15000)
                except Exception as e:
                    entry[theme] = {"error": str(e)[:200]}
                    continue
                await set_theme(page, theme)  # re-apply after navigation
                await page.wait_for_timeout(400)
                slug = route.strip("/").replace("/", "_") or "home"
                shot = OUT / f"{slug}_{theme}.png"
                await page.screenshot(path=str(shot))
                entry[theme]["screenshot"] = str(shot.relative_to(Path.cwd()))
                if theme == "dark":
                    bad = await page.evaluate(EVAL_PANELS, [PANEL_SELECTOR, DARK_MAX_CHANNEL])
                    entry[theme]["panel_mismatches"] = bad
                    report["mismatches"] += len(bad)
            report["routes"].append(entry)

        await browser.close()

    (OUT / "report.json").write_text(json.dumps(report, indent=2))
    print(f"\n=== Visual regression report: {OUT/'report.json'} ===")
    for r in report["routes"]:
        bad = r["dark"].get("panel_mismatches", []) if isinstance(r["dark"], dict) else []
        marker = "OK " if not bad else f"!! {len(bad)} mismatch(es)"
        print(f"  {marker:18s} {r['route']}")
        for b in bad[:5]:
            print(f"    - <{b['tag']}> bg={b['bg']} max={b['maxChannel']}  cls=\"{b['cls']}\"")
    print(f"\nTotal dark-mode panel mismatches: {report['mismatches']}")
    sys.exit(1 if report["mismatches"] else 0)

asyncio.run(main())
