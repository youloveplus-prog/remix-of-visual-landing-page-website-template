"""
Visual regression test for ProductCard price positioning.

Verifies, at xs / sm / md / lg / xl breakpoints, that on the /shop route:
  - the price row never overflows its card horizontally
  - the current price is fully visible (not clipped)
  - the row wraps to at most 2 lines (current price stays on the first line)
  - a screenshot is saved per breakpoint for manual visual review

Run:
    python3 tests/visual/product-card-price.spec.py

Requires Playwright + Chromium available in the sandbox (preinstalled).
Assumes the dev server is reachable at http://localhost:8080.
"""

import asyncio
import json
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = os.environ.get("PREVIEW_URL", "http://localhost:8080")
ROUTE = "/shop?category=AI+Tutor"
OUT = Path(__file__).parent / "__screenshots__" / "product-card-price"
OUT.mkdir(parents=True, exist_ok=True)

# Tailwind-aligned breakpoints. (sm=640, md=768, lg=1024, xl=1280)
BREAKPOINTS = [
    ("xs", 360),
    ("sm", 640),
    ("md", 768),
    ("lg", 1024),
    ("xl", 1280),
]

# Assumes a single line of price text is ~24px tall at our font sizes;
# we allow up to 2 lines (current price + wrapped strike price).
MAX_PRICE_ROW_HEIGHT_PX = 52


async def measure(page):
    """Measure the price row of every visible product card on the page."""
    return await page.evaluate(
        """
        () => {
          const cards = Array.from(document.querySelectorAll('article'));
          return cards.map((card, idx) => {
            const cardRect = card.getBoundingClientRect();
            // Price row is the first flex+items-baseline container in the card content.
            const priceRow = card.querySelector('.flex.items-baseline');
            if (!priceRow) return null;
            const priceRect = priceRow.getBoundingClientRect();
            const currentPrice = priceRow.firstElementChild;
            const currentRect = currentPrice?.getBoundingClientRect();
            return {
              idx,
              cardW: Math.round(cardRect.width),
              priceW: Math.round(priceRect.width),
              priceH: Math.round(priceRect.height),
              priceScrollW: priceRow.scrollWidth,
              priceClientW: priceRow.clientWidth,
              currentPriceTop: currentRect ? Math.round(currentRect.top - priceRect.top) : null,
              text: priceRow.textContent.trim(),
            };
          }).filter(Boolean);
        }
        """
    )


async def run():
    failures = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        sk = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
        sj = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")

        for name, width in BREAKPOINTS:
            ctx = await browser.new_context(viewport={"width": width, "height": 1400})
            page = await ctx.new_page()
            await page.goto(BASE_URL, wait_until="domcontentloaded")
            if sk and sj:
                await page.evaluate(
                    f"window.localStorage.setItem({json.dumps(sk)}, {json.dumps(sj)})"
                )
            await page.goto(f"{BASE_URL}{ROUTE}", wait_until="networkidle")
            await page.wait_for_selector("article", timeout=5000)
            await page.wait_for_timeout(500)

            measurements = await measure(page)
            shot = OUT / f"{name}_{width}.png"
            await page.screenshot(path=str(shot))

            if not measurements:
                failures.append(f"[{name} @ {width}px] no product cards found")
                await ctx.close()
                continue

            for m in measurements[:8]:
                # 1. price row must not overflow horizontally
                if m["priceScrollW"] > m["priceClientW"] + 1:
                    failures.append(
                        f"[{name} @ {width}px] card#{m['idx']} price overflows: "
                        f"scroll={m['priceScrollW']} client={m['priceClientW']} text={m['text']!r}"
                    )
                # 2. price row height must stay within 2 lines
                if m["priceH"] > MAX_PRICE_ROW_HEIGHT_PX:
                    failures.append(
                        f"[{name} @ {width}px] card#{m['idx']} price row too tall: "
                        f"{m['priceH']}px (max {MAX_PRICE_ROW_HEIGHT_PX}px) text={m['text']!r}"
                    )
                # 3. current price (first child) must sit on the first line
                if m["currentPriceTop"] is not None and m["currentPriceTop"] > 4:
                    failures.append(
                        f"[{name} @ {width}px] card#{m['idx']} current price not on first line: "
                        f"top offset={m['currentPriceTop']}px text={m['text']!r}"
                    )

            print(
                f"[{name} @ {width}px] {len(measurements)} cards measured, "
                f"saved {shot.relative_to(Path.cwd()) if shot.is_relative_to(Path.cwd()) else shot}"
            )
            await ctx.close()

        await browser.close()

    if failures:
        print("\nFAIL — price-positioning assertions:")
        for f in failures:
            print("  -", f)
        sys.exit(1)
    print("\nPASS — price positioning is healthy across all breakpoints.")


if __name__ == "__main__":
    asyncio.run(run())
