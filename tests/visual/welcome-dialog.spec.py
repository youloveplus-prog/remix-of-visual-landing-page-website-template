"""
Verifies the FirstRunTour welcome dialog on first homepage load:
  - opens automatically when localStorage flag is absent
  - is centered in the viewport
  - is interactive (Skip + Next buttons clickable; dialog dismisses)

Run:
    python3 tests/visual/welcome-dialog.spec.py
    PREVIEW_URL=http://localhost:8080 python3 tests/visual/welcome-dialog.spec.py

Output: tests/visual/__screenshots__/welcome-dialog/*.png
Exit code: 0 on pass, 1 on any assertion failure.
"""

import asyncio
import os
import sys
from pathlib import Path
from playwright.async_api import async_playwright

BASE = os.environ.get("PREVIEW_URL", "http://localhost:8080")
OUT = Path(__file__).parent / "__screenshots__" / "welcome-dialog"
OUT.mkdir(parents=True, exist_ok=True)

VIEWPORTS = [
    ("desktop", {"width": 1280, "height": 900}),
    ("mobile", {"width": 390, "height": 844}),
]

CENTER_TOLERANCE_PX = 24  # allow small offset for safe-area padding


async def assert_centered(box, viewport, label):
    cx = box["x"] + box["width"] / 2
    cy = box["y"] + box["height"] / 2
    vx = viewport["width"] / 2
    vy = viewport["height"] / 2
    dx = abs(cx - vx)
    dy = abs(cy - vy)
    assert dx <= CENTER_TOLERANCE_PX, (
        f"[{label}] dialog not horizontally centered: "
        f"center_x={cx:.1f} viewport_mid={vx:.1f} dx={dx:.1f}px"
    )
    assert dy <= CENTER_TOLERANCE_PX, (
        f"[{label}] dialog not vertically centered: "
        f"center_y={cy:.1f} viewport_mid={vy:.1f} dy={dy:.1f}px"
    )


async def run_for_viewport(playwright, label, viewport):
    browser = await playwright.chromium.launch(headless=True)
    context = await browser.new_context(viewport=viewport)
    page = await context.new_page()

    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))

    # Visit once to set origin, then clear storage so the tour fires on reload.
    await page.goto(BASE, wait_until="domcontentloaded")
    await page.evaluate("() => { try { localStorage.clear(); } catch {} }")
    await page.goto(BASE, wait_until="domcontentloaded")

    dialog = page.get_by_role("dialog")
    await dialog.wait_for(state="visible", timeout=5000)

    # Heading from STEPS[0]
    await page.get_by_text("Welcome to ASIKON").wait_for(timeout=3000)

    box = await dialog.bounding_box()
    assert box is not None, f"[{label}] dialog has no bounding box"
    await assert_centered(box, viewport, label)

    await page.screenshot(path=str(OUT / f"{label}_open.png"))

    # Interactivity: Next advances, then Skip dismisses.
    next_btn = page.get_by_role("button", name="Next")
    await next_btn.click()
    await page.get_by_text("Learn 24/7 with AI").wait_for(timeout=3000)

    skip_btn = page.get_by_role("button", name="Skip welcome tour")
    await skip_btn.click()
    await dialog.wait_for(state="hidden", timeout=3000)
    await page.screenshot(path=str(OUT / f"{label}_dismissed.png"))

    # Flag persisted -> no re-open on reload.
    await page.reload(wait_until="domcontentloaded")
    await page.wait_for_timeout(1500)
    assert await page.get_by_role("dialog").count() == 0, (
        f"[{label}] dialog reappeared after dismissal"
    )

    assert not errors, f"[{label}] page errors: {errors}"
    await browser.close()
    print(f"  OK [{label}]")


async def main():
    async with async_playwright() as pw:
        for label, vp in VIEWPORTS:
            print(f"==> {label} {vp}")
            await run_for_viewport(pw, label, vp)
    print("welcome-dialog: PASS")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except AssertionError as e:
        print(f"FAIL: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
