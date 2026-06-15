## Goal
Bring back the two-row header layout (brand/search/actions on top, navigation on a dedicated band below) while keeping the new compact, minimal aesthetic — no extra chrome, no trust strip, no decorative gradients.

## Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Row 1 (h ~44px)   ◧ Brand        🔍 Search        🛒 🔔 👤  │
├──────────────────────────────────────────────────────────────┤
│  Row 2 (h ~38px)   Learn  Explore  Community  Mentorship  About │
└──────────────────────────────────────────────────────────────┘
```

- Row 1: solid `bg-background/80` blur, single hairline `border-border/50` bottom.
- Row 2: same surface, slightly lower opacity (`bg-background/60`), hairline bottom. Centered mega-menu on Home, left-aligned on inner pages.
- No inset highlight shadows, no radial gradients, no extra dividers — just hairlines and tokens.
- Both rows stack inside the same fixed header so total height ≈ 82px (vs. previous 110px+).

## Files to edit

- `src/components/layout/HomeTopHeader.tsx` — split single row back into two: Row 1 (HeaderBrand · SmartSearch · Cart · Notifications · UserMenu), Row 2 (`<MegaMenu />` centered).
- `src/components/layout/DesktopHeader.tsx` — Row 1 (HeaderBrand · SmartSearch · actions), Row 2 (`<MegaMenu />` left-aligned in `container-editorial`). Mega menu moves out of Row 1.
- `src/components/layout/SlimDesktopHeader.tsx` — same two-row split, no breadcrumbs, no Browse fallback.
- `src/components/layout/MegaMenu.tsx` — keep current compact h-8 pill triggers; no further changes.

## Visual rules (minimal + modern)

- Surface: `bg-background/80 backdrop-blur-2xl` (Row 1), `bg-background/60 backdrop-blur-xl` (Row 2). Dark: `bg-black/85` / `bg-black/70`.
- Borders: only `border-b border-border/50 dark:border-white/10` between rows and at bottom.
- Scroll state: add subtle `shadow-[0_8px_24px_-16px_hsl(0_0%_0%/0.3)]` to the header wrapper only when scrolled — no color shifts, no inset shadows.
- Spacing: Row 1 `py-1.5`, Row 2 `py-1`. Action buttons stay `h-9 w-9`. Mega menu triggers stay `h-8`.
- No `TrustStrip`, no `Breadcrumbs`, no `BrowseMenu` re-introduction.

## Out of scope

- MobileHeader (already compact at 44px, single row).
- Mega-menu panel internals.
- Settings/theme/currency toggles (live on Settings page).
