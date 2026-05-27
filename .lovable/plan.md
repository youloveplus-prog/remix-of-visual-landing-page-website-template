## Goal
Add a Flexipay-inspired top section to the home page. Keep all current sections intact below it.

## New top section (mobile-first, reference image)

Stacked blocks above the existing home content:

1. **Top bar** — left circular icon button (grid / menu), center wordmark "ASIKON", right circular icon button (avatar / notifications). White circular buttons, subtle border.
2. **Search bar** — full-width pill input "Search & learn anywhere" with leading search icon.
3. **Pill action row** — 5 rounded-square tiles with colored icon backgrounds + label underneath:
   - Shop (blue) → /shop
   - Courses (green) → /shop?type=courses
   - AI Tutor (purple) → /ai-tutor (or existing tutor route)
   - Deals (pink) → /shop?filter=deals
   - Saved (orange) → /saved (or /profile)
4. **Featured CTA banner** — dark rounded card ("Start learning today" / "Pick a path in one tap") with chevron, links to /shop.
5. **Two-stat card row** — white rounded card split in 2: "120+ Lessons" (with badge icon), "24/7 AI Tutor" (with badge icon).
6. **Activity quick grid** — 5 small rounded tiles in a row: All courses, In progress, Completed, Wishlist, Add goal. Soft pastel backgrounds.
7. **Top Brands strip** — section header "Top Brands" + horizontal scroller of circular brand chips (use existing brands or course-category logos placeholder).

## Scope

- New file: `src/components/home/mobile/FlexiTopSection.tsx` — self-contained, theme-aware (uses `midnight-tile`, semantic tokens, no hardcoded colors except for the soft pastel icon backgrounds which use `bg-*-500/10 text-*-500` tailwind utilities).
- Edit: `src/pages/Index.tsx` — render `<FlexiTopSection />` as the FIRST child inside `<MobilePage>` for BOTH signed-in and signed-out branches. Keep everything else exactly as-is.

## Visual treatment

- Reuse `midnight-tile` for cards (auto light/dark via existing scope).
- Pill icon tiles: `rounded-2xl bg-card border border-border w-14 h-14` with colored icon inside (`text-blue-500`, `text-emerald-500`, `text-purple-500`, `text-pink-500`, `text-amber-500`).
- Dark banner: `bg-foreground text-background` rounded-2xl with right chevron.
- Stat split card: single `midnight-tile`, divided 50/50 with `divide-x divide-border`.
- All routes hooked to existing pages where possible; unknown routes (saved, deals) default to `/shop` with appropriate query.

## Out of scope
No changes to data, hooks, business logic, or existing sections. Bottom tab bar from the reference is NOT added (project already has its own nav).
