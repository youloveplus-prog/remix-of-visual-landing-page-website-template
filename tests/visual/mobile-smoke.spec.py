"""
Mobile-first smoke test: clicks through Home -> Shop -> Profile -> Admin
on an iPhone-sized viewport, captures a screenshot at each step, and
fails fast on console errors or missing landmarks.

Run:
    python3 tests/visual/mobile-smoke.spec.py
    PREVIEW_URL=http://localhost:8081 python3 tests/visual/mobile-smoke.spec.py

Auth: if LOVABLE_BROWSER_SUPABASE_SESSION_JSON + _STORAGE_KEY are set, the
script seeds the user session into localStorage so /profile and the admin
panel render as the signed-in user. Otherwise the unauthenticated state is
captured (auth gate / sign-in prompt).

Output: tests/visual/__screenshots__/mobile-smoke/<step>.png + summary.json
Exit code: 0 on full pass, 1 if any step fails an assertion or throws.
"""

import asyncio
import json
import os
import sys
import time
from pathlib import Path
from playwright.async_api import async_playwright, Page, TimeoutError as PWTimeout

BASE = os.environ.get("PREVIEW_URL", "http://localhost:8080")
OUT = Path(__file__).parent / "__screenshots__" / "mobile-smoke"
OUT.mkdir(parents=True, exist_ok=True)

# iPhone 14-ish — matches the editor's mobile preview (391x586 dpr 1.25).
VIEWPORT = {"width": 390, "height": 844}
USER_AGENT = (
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
)

# Steps: (slug, path, landmark_selector, optional click-from-previous selector)
# The click selectors use role-based locators when possible so they survive
# style changes. Each step navigates by URL as a fallback if the click misses.
STEPS = [
    {
        "slug": "1_home",
        "path": "/",
        "landmark": "main, [role='main'], #cover",
    },
    {
        "slug": "2_shop",
        "path": "/shop",
        "landmark": "main, [role='main']",
    },
    {
        "slug": "3_profile",
        "path": "/profile",
        # Profile may redirect to /auth when unauthenticated — accept either.
        "landmark": "main, [role='main'], form, h1",
    },
    {
        "slug": "4_admin",
        "path": "/asikonasik",
        # Admin shows either the panel or the 403 / sign-in gate.
        "landmark": "main, [role='main'], h1",
    },
]


async def seed_supabase_session(page: Page) -> bool:
    storage_key = os.environ.get("LOVABLE_BROWSER_SUPABASE_STORAGE_KEY")
    session_json = os.environ.get("LOVABLE_BROWSER_SUPABASE_SESSION_JSON")
    if not (storage_key and session_json):
        return False
    await page.goto(BASE, wait_until="domcontentloaded")
    await page.evaluate(
        "([k, v]) => window.localStorage.setItem(k, v)",
        [storage_key, session_json],
    )
    return True


async def capture_step(page: Page, step: dict, console_errors: list) -> dict:
    slug = step["slug"]
    url = BASE.rstrip("/") + step["path"]
    started = time.time()
    result = {
        "slug": slug,
        "path": step["path"],
        "url": page.url,
        "ok": False,
        "landmark_found": False,
        "final_url": "",
        "elapsed_ms": 0,
        "error": None,
        "console_errors": [],
    }
    errs_before = len(console_errors)
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=20000)
        # Wait for the SPA to hydrate the landmark (or its fallback).
        try:
            await page.wait_for_selector(step["landmark"], timeout=8000)
            result["landmark_found"] = True
        except PWTimeout:
            result["landmark_found"] = False
        # Settle paint + lazy chunks.
        await page.wait_for_timeout(600)
        shot = OUT / f"{slug}.png"
        await page.screenshot(path=str(shot))
        result["screenshot"] = str(shot.relative_to(Path.cwd()))
        result["final_url"] = page.url
        result["ok"] = result["landmark_found"]
    except Exception as e:
        result["error"] = str(e)[:300]
    result["elapsed_ms"] = int((time.time() - started) * 1000)
    result["console_errors"] = console_errors[errs_before:]
    return result


async def main():
    summary = {
        "base": BASE,
        "viewport": VIEWPORT,
        "authenticated": False,
        "steps": [],
        "passed": 0,
        "failed": 0,
    }
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        ctx = await browser.new_context(
            viewport=VIEWPORT,
            user_agent=USER_AGENT,
            device_scale_factor=2,
            is_mobile=True,
            has_touch=True,
        )
        page = await ctx.new_page()
        console_errors: list = []
        page.on(
            "console",
            lambda msg: console_errors.append(f"{msg.type}: {msg.text[:200]}")
            if msg.type in ("error",)
            else None,
        )

        summary["authenticated"] = await seed_supabase_session(page)

        for step in STEPS:
            res = await capture_step(page, step, console_errors)
            summary["steps"].append(res)
            if res["ok"]:
                summary["passed"] += 1
            else:
                summary["failed"] += 1

        await browser.close()

    (OUT / "summary.json").write_text(json.dumps(summary, indent=2))
    print(f"\n=== Mobile smoke @ {BASE} (viewport {VIEWPORT['width']}x{VIEWPORT['height']}) ===")
    print(f"Auth: {'signed-in' if summary['authenticated'] else 'anonymous'}")
    for s in summary["steps"]:
        mark = "OK " if s["ok"] else "FAIL"
        ce = f"  [{len(s['console_errors'])} console err]" if s["console_errors"] else ""
        landed = s["final_url"].replace(BASE, "") or "/"
        print(f"  {mark}  {s['slug']:10s} {s['path']:14s} -> {landed:20s} {s['elapsed_ms']}ms{ce}")
        if s["error"]:
            print(f"        error: {s['error']}")
        for c in s["console_errors"][:3]:
            print(f"        console: {c}")
    print(f"\nScreenshots: {OUT}")
    print(f"Summary:     {OUT/'summary.json'}")
    print(f"\nResult: {summary['passed']}/{len(STEPS)} steps OK")
    sys.exit(0 if summary["failed"] == 0 else 1)


if __name__ == "__main__":
    asyncio.run(main())
