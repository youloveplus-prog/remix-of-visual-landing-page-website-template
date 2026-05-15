# Desktop UI Upgrade — Premium Editorial + Glass Motion

Goal: make ASIKON feel Awwwards-level on desktop while staying mobile-friendly. Bigger type, more whitespace where it earns it, denser grid where info matters, and consistent liquid-glass surfaces with subtle motion. Mobile gets a light polish but layouts stay intact.

## 1. Global shell (header + sidebar)

`src/components/layout/DesktopHeader.tsx`, `DesktopSidebar.tsx`, `TrustStrip.tsx`, `index.css`

- Taller header on desktop (72px), thin gradient hairline border, true glass: `bg-background/60 backdrop-blur-2xl saturate-150` instead of solid.
- Logo lockup with Space Grotesk wordmark + tiny "AI Learning" eyebrow. Active route gets a pill-glow underline.
- Search becomes a centered command-style input (`⌘K` hint), expands on focus with soft inner shadow.
- Sidebar: increase expanded width to 248px, refine collapsed rail to 64px with centered glyphs + tooltip. Section labels in `text-[10px] uppercase tracking-[0.18em] text-muted-foreground`. Active item: gradient chip + left accent bar in primary red.
- TrustStrip restyled as a slim marquee of 4 trust pills with separators (no boxy background).

## 2. Home page (`src/pages/Index.tsx`)

Editorial hero + denser content rails.

- New magazine hero: 12-col grid → left 7 cols big headline (Space Grotesk, clamp 40-72px), kicker eyebrow, dual CTA, trust micro-row; right 5 cols stacked TodayMissionCard + a glass "Live Stats" tile (XP, streak, learners online).
- Section headers get a left vertical accent bar + small "View all →" with story-link underline.
- Horizontal carousels: show partial next card (peek) on desktop, snap scroll, gradient fade edges.
- Add a "Tracks" magazine grid section: 1 large + 2 small bento cards using `bento-grid` style.
- Footer band: glass strip with mission/vision teaser using `<MissionVision />` (must keep — per project memory).

## 3. Shop (`src/pages/Shop.tsx`, `ProductCard.tsx`, `ShopFilters.tsx`)

Denser, more shoppable.

- Desktop: persistent left filter rail (240px) + 4-col product grid at xl, 5-col at 2xl. Mobile keeps current sheet.
- ProductCard polish: rounded-2xl, hover lifts (`translate-y-[-2px]` + soft shadow), image zoom on hover, quick-view button fades in over image, price row pinned bottom (already done).
- Sticky sub-header with sort + result count + view toggle (grid/list).

## 4. Community (`src/pages/Community.tsx` + tabs)

- Two-column desktop: main feed (max 720px) + right rail with creators-to-follow, trending tags, live-now strip. Mobile unchanged.
- Cards become true glass with tighter padding and consistent 16px radius.

## 5. Profile (`src/pages/Profile.tsx`)

- Editorial header: large avatar left, name in Space Grotesk display, stats row in a glass strip, action buttons right-aligned.
- Tabs styled as segmented glass control.

## 6. Design tokens & motion (`src/index.css`, `tailwind.config.ts`)

- Add `--glass-bg`, `--glass-border`, `--glass-shadow` HSL tokens + `.glass`, `.glass-strong`, `.glass-hairline` utility classes.
- Add `--shadow-elegant`, `--gradient-brand`, `--gradient-aurora` tokens (dark red → ember).
- Add keyframes: `aurora-shift`, `float-y`, `shimmer`. Wire into hero background and section accents at low intensity (respect `prefers-reduced-motion`).
- Standardize radius scale: `--radius` 16px, cards 20px, hero 28px.

## 7. Mobile polish (light pass)

- Match header glass treatment (already mostly there).
- Update section headers to match desktop accent bar.
- Leave BottomNav, page structures, and tab layouts alone.

## Out of scope

- Admin pages (`/asikonasik/*`).
- Functional/business logic changes — visual & layout only.
- Onboarding wizard, Lesson/Track detail pages (separate pass).

## Technical notes

- All colors via HSL semantic tokens in `index.css` + `tailwind.config.ts` — no raw color classes in components.
- Reuse existing `embla-carousel-react` carousels; only change styling/peek behavior.
- Keep `<MissionVision />` import on Home, Auth, Profile, Settings (project memory rule).
- Keep infinite-loop scrolling behavior in feeds (no "Load more").
- Preserve route structure and persistent BottomNav shell in `App.tsx`.

```text
Desktop layout target
┌──────────────────────────────────────────────────────────┐
│  glass header  ⌘K search        notifications  avatar    │
├────────┬─────────────────────────────────────────────────┤
│ side   │  HERO (7col headline + 5col mission/stats)      │
│ rail   │  ── tracks bento ──                             │
│ 248px  │  ── product carousel (peek) ──                  │
│        │  ── community rail ──                           │
│        │  ── mission/vision glass band ──                │
└────────┴─────────────────────────────────────────────────┘
```
