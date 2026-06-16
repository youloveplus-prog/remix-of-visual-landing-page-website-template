"""
Visual regression test for the "Why ASIKON" editorial card (IssueIndex).

Catches responsive typography, spacing, and pulse-dot regressions across
xs / sm / md / lg breakpoints on the home route.

Assertions per breakpoint:
  - card is rendered and visible
  - card does not overflow its viewport horizontally
  - headline font-size sits within an expected responsive band
  - mono "Mission 01" label is readable (>= 10px)
  - footer pulse dot is present, visible, and >= 7px
  - footer "Core Identity" label is on screen (not clipped)
  - a clipped screenshot of just the card is saved for baseline diffing

Run:
    python3 tests/visual/issue-index-card.spec.py

Pairs with tests/visual/diff.py for pixel baselines (same folder convention).
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("PREVIEW_URL", "http://localhost:8080")
ROUTE = "/"
OUT = Path(__file__).parent / "__screenshots__" / "issue-index-card"
OUT.mkdir(parents=True, exist_ok=True)

# (name, width, headline_min_px, headline_max_px)
# Headline classes: text-[40px] sm:text-[48px] lg:text-[56px]
BREAKPOINTS = [
    ("xs", 360, 38, 42),
    ("sm", 640, 46, 50),
    ("md", 768, 46, 50),
    ("lg", 1024, 54, 58),
    ("xl", 1280, 54, 58),
]


async def measure(page):
    return await page.evaluate(
        """
        () => {
          const card = document.querySelector('[data-testid="issue-index-card"]');
          if (!card) return null;
          const rect = card.getBoundingClientRect();
          const h2 = card.querySelector('h2');
          const monoLabel = card.querySelector('span.font-mono');
          const pulseDot = card.querySelector('.animate-ping');
          const footerLabel = card.querySelectorAll('span.font-mono');
          const footer = footerLabel[footerLabel.length - 1];
          const fRect = footer?.getBoundingClientRect();
          const pRect = pulseDot?.parentElement?.getBoundingClientRect();
          const cs = h2 ? getComputedStyle(h2) : null;
          const ls = monoLabel ? getComputedStyle(monoLabel) : null;
          return {
            cardW: Math.round(rect.width),
            cardH: Math.round(rect.height),
            cardLeft: Math.round(rect.left),
            cardRight: Math.round(rect.right),
            headlineFontPx: cs ? parseFloat(cs.fontSize) : null,
            headlineLineHeightPx: cs ? parseFloat(cs.lineHeight) : null,
            labelFontPx: ls ? parseFloat(ls.fontSize) : null,
            pulseSize: pRect ? Math.round(Math.max(pRect.width, pRect.height)) : 0,
            footerVisible: !!fRect && fRect.bottom <= window.innerHeight + 1 && fRect.right <= window.innerWidth + 1,
            footerText: footer?.textContent?.trim() ?? null,
          };
        }
        """
    )


async def run():
    failures = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        sk = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
        sj = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")

        for name, width, h_min, h_max in BREAKPOINTS:
            ctx = await browser.new_context(viewport={"width": width, "height": 1600})
            page = await ctx.new_page()
            await page.goto(BASE_URL, wait_until="domcontentloaded")
            if sk and sj:
                await page.evaluate(
                    f"window.localStorage.setItem({json.dumps(sk)}, {json.dumps(sj)})"
                )
            await page.goto(f"{BASE_URL}{ROUTE}", wait_until="networkidle")
            try:
                await page.wait_for_selector('[data-testid="issue-index-card"]', timeout=8000)
            except Exception:
                failures.append(f"[{name} @ {width}px] editorial card not found")
                await ctx.close()
                continue

            # Scroll into view so Reveal triggers and the card is fully painted.
            await page.evaluate(
                "document.querySelector('[data-testid=\\'issue-index-card\\']').scrollIntoView({block:'center'})"
            )
            await page.wait_for_timeout(600)

            m = await measure(page)
            if not m:
                failures.append(f"[{name} @ {width}px] could not measure card")
                await ctx.close()
                continue

            # 1. card must not overflow viewport horizontally
            if m["cardLeft"] < -1 or m["cardRight"] > width + 1:
                failures.append(
                    f"[{name} @ {width}px] card overflows viewport: "
                    f"left={m['cardLeft']} right={m['cardRight']} vw={width}"
                )
            # 2. headline font-size in expected band
            if m["headlineFontPx"] is None or not (h_min <= m["headlineFontPx"] <= h_max):
                failures.append(
                    f"[{name} @ {width}px] headline font-size {m['headlineFontPx']}px "
                    f"out of band [{h_min}, {h_max}]"
                )
            # 3. headline tight leading (< font-size, since leading-[0.9])
            if (
                m["headlineFontPx"]
                and m["headlineLineHeightPx"]
                and m["headlineLineHeightPx"] > m["headlineFontPx"] * 0.95
            ):
                failures.append(
                    f"[{name} @ {width}px] headline line-height {m['headlineLineHeightPx']}px "
                    f"too loose for font {m['headlineFontPx']}px (expected ~0.9)"
                )
            # 4. mono label readable
            if m["labelFontPx"] is None or m["labelFontPx"] < 10:
                failures.append(
                    f"[{name} @ {width}px] mono label too small: {m['labelFontPx']}px"
                )
            # 5. pulse dot present + sized
            if m["pulseSize"] < 7:
                failures.append(
                    f"[{name} @ {width}px] pulse dot missing or too small: {m['pulseSize']}px"
                )
            # 6. footer label visible and labeled correctly
            if not m["footerVisible"]:
                failures.append(f"[{name} @ {width}px] footer label clipped off-screen")
            if m["footerText"] and "Core Identity" not in m["footerText"]:
                failures.append(
                    f"[{name} @ {width}px] footer text changed: {m['footerText']!r}"
                )

            # Clipped screenshot of just the card (stable for baseline diffing).
            card = await page.query_selector('[data-testid="issue-index-card"]')
            shot = OUT / f"{name}_{width}.png"
            await card.screenshot(path=str(shot))
            print(
                f"[{name} @ {width}px] card {m['cardW']}x{m['cardH']}, "
                f"h2={m['headlineFontPx']}px, label={m['labelFontPx']}px, "
                f"pulse={m['pulseSize']}px -> {shot.name}"
            )
            await ctx.close()

        await browser.close()

    if failures:
        print("\nFAIL — editorial card assertions:")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("\nPASS — editorial card is healthy across all breakpoints.")


if __name__ == "__main__":
    asyncio.run(run())
