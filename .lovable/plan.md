## Goal
Keep the mobile bottom navigation bar visible on every page.

## Current behavior
`src/App.tsx` → `PersistentMobileShell` hides the `BottomNav` on these routes:
`/auth`, `/asikonasik`, `/checkout`, `/lesson`, `/learn`, `/create`, `/reset-password`.

## Change
- Remove the `hideOn` route exclusion list in `PersistentMobileShell` so `BottomNav` renders on all routes when `isMobile` is true.
- Keep the `isMobile` check (desktop continues to use the sidebar).
- Spot-check `Learn`, `CreateContent`, `Checkout`, `LessonDetail`, and `Auth` pages to ensure their bottom padding (or sticky action bars) don't get covered. Add `pb-24` / safe-area padding where content currently assumes no bottom nav.

## Files touched
- `src/App.tsx` — drop the hideOn array.
- Any of the above pages that lack bottom padding — add spacing so content isn't hidden behind the nav.
