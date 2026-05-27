# Redesign mobile top section

The current `FlexiTopSection` repeats the same `PillTile` pattern twice (5 action pills + 5 activity pills) and duplicates work done by sections directly below it on the home page:

- `QuickAccessGrid` already renders Tutor / Shop / Community / Mentors tiles
- `ProgressSnapshot` + `ActivityFeed` already cover "in progress / completed / wishlist"
- `ImageHeroSlider` sits right above it, so a second "Start learning" CTA banner is redundant

The redesign collapses this block into one clean, non-repeating unit.

## New structure (mobile only)

```text
┌─────────────────────────────────────────────┐
│  🔍  Search & learn anywhere          ⌘    │  ← refined search pill
├─────────────────────────────────────────────┤
│  ┌─────────────────────┬─────────────────┐  │
│  │  Gradient hero half │  Stats half     │  │  ← one combined card
│  │  Start learning →   │  120+ lessons   │  │
│  │  Pick a path        │  24/7 AI tutor  │  │
│  └─────────────────────┴─────────────────┘  │
├─────────────────────────────────────────────┤
│  [Shop] [Courses] [AI Tutor] [Deals]        │  ← 4 essential pills (was 10)
└─────────────────────────────────────────────┘
```

Removed: the second pill row (All courses / In progress / Completed / Wishlist / Add goal) — already covered by `ProgressSnapshot` + `ActivityFeed` below.
Removed: standalone "Saved" pill — lives in profile/header.
Merged: gradient CTA banner + two-stat card into one split card (gradient left half is the CTA, neutral right half shows the two stats stacked).

## UI enhancements

- Search pill gets a subtle inner glow + ⌘K hint on the right
- Combined hero/stats card uses `var(--gradient-primary)` on the left half and `bg-card` on the right, joined by a soft inner divider — single rounded `rounded-3xl` shell with the existing brand shadow
- Pill row drops from 5 to 4 tiles, tiles grow to `w-16 h-16` for stronger tap targets, icon chip uses a glass treatment (`bg-white/15 backdrop-blur` over the gradient) for the liquid-glass house style
- Spacing tightens from `space-y-5` to `space-y-4`; section padding stays `section-x`

## Technical details

- File: `src/components/home/mobile/FlexiTopSection.tsx` — full rewrite, no other files touched
- Drop the `activityTiles` array, `Plus`, `Heart`, `CheckCircle2`, `PlayCircle`, `BookOpen`, `Bot`, `Bookmark` imports that become unused
- Keep `PillTile` but slim it (no nested chip-in-chip; one rounded gradient tile with icon centered)
- All colors via semantic tokens / existing gradient var — no raw hex
- `Index.tsx` integration unchanged (`<FlexiTopSection />` still rendered under `lg:hidden`)

## Out of scope

- Desktop bento (`DesktopHeroBento`) — untouched
- `QuickAccessGrid`, `ProgressSnapshot`, `ActivityFeed` — left as the single source of truth for their respective concerns
- Routing / data wiring