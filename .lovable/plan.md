# Redesign Home Page in Higgsfield.ai style

Scope: only `src/pages/Index.tsx` and its home-section components. Header/footer/other pages untouched. No backend changes.

## Visual reference (Higgsfield.ai)

- Pure black canvas (`#0a0a0a`), 1px hairline borders at white/8%.
- Neon-lime accent (`#c6f24e`) used only for promo strip, primary CTA, NEW pills.
- Condensed grotesk display font, ALL-CAPS tiny labels.
- Everything is a media tile: full-bleed cover image, 2-line title overlay, tiny meta row underneath. No glass, no big rounded corners (radius 10–12px).
- Dense bento grids, horizontal rails, zero decorative whitespace.

## New home layout

```text
┌──────────────────────────────────────────────────────┐
│ NEON PROMO TICKER  (lime bar, scrolling text)        │
├──────────────────────────────────────────────────────┤
│ FEATURED ROW   4 large media tiles (16:10)           │
│   ├ tile = cover, title bottom-left, "Open →" CTA    │
├──────────────────────────────────────────────────────┤
│ TOOLS BENTO   3-col grid of product surfaces         │
│   AI Tutor · Mentors · Prompts · Game · Resources    │
│   each: icon, name, 1-line desc, NEW/HOT pill        │
├──────────────────────────────────────────────────────┤
│ TRENDING COURSES  horizontal rail, image-first cards │
├──────────────────────────────────────────────────────┤
│ COMMUNITY STRIP   live posts ticker / avatars row    │
├──────────────────────────────────────────────────────┤
│ MISSION BLOCK    <MissionVision /> restyled on dark  │
├──────────────────────────────────────────────────────┤
│ CTA FOOTER       full-bleed "Start learning" panel   │
└──────────────────────────────────────────────────────┘
```

## Components to build

New folder `src/components/home/higgsfield/`:
1. `NeonPromoTicker.tsx` — lime bar, marquee text, dismiss.
2. `FeaturedMediaRow.tsx` — 4-up tile grid from existing banner data.
3. `ToolsBentoGrid.tsx` — surfaces from `NAV_ITEMS` as tiles.
4. `TrendingRail.tsx` — horizontal-scroll wrapper reusing course/product data.
5. `CommunityStrip.tsx` — compact live-posts row.
6. `HomeCtaPanel.tsx` — final CTA block.

Edit `src/pages/Index.tsx` to compose only these sections (replace existing home sections).

## Tokens (scoped, no global theme break)

- Add a `.home-higgsfield` wrapper class in `src/index.css` that overrides `--background`, `--card`, `--border`, `--primary`, `--radius` only inside the home page. Other pages keep current warm theme.
- No changes to `tailwind.config.ts`.

## Out of scope

- Header, footer, shop, course detail, auth, admin — unchanged.
- No new fonts globally (use existing stack at heavier weights / tighter tracking).
- No data/schema/route changes.

## Reuses existing data

- `useHomeBanners`, `useHomeSections`, `useProducts`, `usePosts`, `<MissionVision />`.

## Verification

- Build passes, 181 tests still green.
- `/` renders new layout; all other routes visually unchanged.

## Open question

Use Higgsfield's exact neon lime `#c6f24e`, or keep your indigo `#3b4fe0` as the accent on the dark home only?
