# Soften & Deepen Card Surfaces (Global)

Goal: make every card across the app feel physical and calm — softer hairline borders, gentle layered shadows for depth, and richer-but-quieter gradients. No structural or behavioral changes; pure visual token + component-class refinement.

## Why
Current cards use a flat 1px `border-border` and a single `shadow-sm`, which reads digital and "stuck on" the page. Some gradients (especially the indigo/blue accents and the warm cream chips) are saturated enough to be tiring on long reads.

## Design rules
- **Borders**: replace harsh 1px lines with a hairline (0.5px on dpr≥2) at lower opacity, plus a subtle inner top highlight for a "lit edge" effect.
- **Depth**: two-layer shadow — a tight contact shadow + a wider ambient shadow — instead of one flat shadow. Tuned per theme.
- **Gradients**: lower stop saturation, add a 3rd subtle mid-stop, and use diagonal 135° consistently. Add a faint top sheen overlay for tactile feel.
- **Eye comfort**: drop pure white / pure black surfaces in cards by 2–4% toward the warm cream / near-black tokens; raise muted-foreground contrast slightly so text stays readable on the new softer surface.

## Scope of files

### Tokens (single source of truth)
- `src/index.css` — update card-related CSS variables for both `:root` and `.dark`:
  - `--card`, `--card-foreground` (very minor warmth shift)
  - `--border` → lower alpha variant `--border-soft`
  - Add `--shadow-card`, `--shadow-card-hover`, `--shadow-card-pressed` (two-layer)
  - Add `--gradient-card-sheen` (top inner highlight)
  - Retune existing brand gradients: `--gradient-primary`, `--gradient-warm-*`, chip surfaces (butter/lavender/mint) — reduce saturation ~10%, add mid-stop.
- `tailwind.config.ts` — expose `shadow-card`, `shadow-card-hover`, `border-soft`, and new gradient utilities.

### Base card primitive
- `src/components/ui/card.tsx` — swap default classes to use `border-border-soft`, `shadow-card`, `bg-gradient-card-sheen` overlay (via `before:` pseudo), `rounded-[20px]` to match bento spec.

### Recurring card surfaces (audit + align to new tokens, no layout change)
- `src/components/shop/ProductCard.tsx`
- `src/components/shop/CourseVideoCard.tsx`
- `src/components/carousels/*` (Hero, Product, Category, Story, Resource)
- `src/components/resources/ResourceCard.tsx`, `FeaturedEventCard.tsx`
- `src/components/home/*` tiles
- `src/components/course-detail/CourseVideoCard.tsx`, `CourseProgressCard.tsx`
- `src/components/mentorship/MentorBookingPanel.tsx`, `MentorshipHomeSection.tsx`
- `src/components/community/*` post & review cards
- `src/components/profile/*` stat / order tiles
- `src/features/mission/TodayMissionCard.tsx`, `features/progress/*`
- `src/components/admin/GlassPanel.tsx` (admin glass cards — retune ring + shadow)

For each: replace ad-hoc `border`, `shadow-sm`, `bg-white`/`bg-card` combos with the new tokens. Remove hardcoded color/shadow utilities.

## Technical details
- Hairline border technique: `border border-border-soft` + `[box-shadow:inset_0_1px_0_hsl(var(--card-sheen)/0.6),var(--shadow-card)]`.
- Two-layer shadow example (light):
  - `0 1px 2px hsl(var(--foreground)/0.04), 0 8px 24px -8px hsl(var(--foreground)/0.08)`
- Two-layer shadow (dark): swap to `hsl(0 0% 0% / 0.5)` + colored ambient `hsl(var(--primary)/0.08)` for the lit-from-screen feel.
- Hover: lift to `shadow-card-hover` + `-translate-y-0.5` (keep existing motion preferences via `useMotion`).
- Gradient retune: keep brand `#3b4fe0` but mix toward `#5a6ce8` at 50% stop and `#3242b5` at 100% for richer depth without raising chroma.

## Verification
- Run dev server, take Playwright screenshots of Home, Shop, Course Detail, Community, Profile in both light & dark at 390×844 and 1280×900.
- Visual diff against current using `scripts/visual-regression-theme.py`.
- Confirm all 181 tests still pass.
- Check existing `scripts/audit-light-bg.js` to ensure no new hardcoded whites.

## Out of scope
- No copy, layout, or interaction changes.
- No new components, no new pages.
- No changes to bottom nav, header, sidebar chrome (cards only).
