# About Page Redesign — ASIKON

Replace the current minimal `/about` page with a full editorial-style About page inspired by Whop's bold, oversized-typography, story-driven layout — adapted to ASIKON's brand (dark red gradient, glass surfaces, Inter + Space Grotesk, AI-powered learning positioning).

## Page sections (top to bottom)

1. **Hero band** (`aurora-bg`, full-width inside `container-editorial`)
   - Eyebrow: "About ASIKON"
   - Massive `display-1` headline: "Learning, reimagined for every Bangladeshi student."
   - Sub-headline (body-lg, muted): one-line positioning.
   - Two CTAs: "Start learning" → `/onboarding`, "Explore tracks" → `/learn`.
   - Soft floating glass stat chips (learners, lessons, tracks, AI tutors) layered on aurora.

2. **Mission + Vision** — reuse existing `<MissionVision />` component (per memory rule). Wrapped in a `PageSection` with eyebrow "What drives us".

3. **The story** — 2-column editorial split (`SplitLayout`):
   - Left: large pull-quote / origin narrative (3 short paragraphs).
   - Right: sticky glass card with founding year, location (Dhaka, BD), and a signature.

4. **Numbers that matter** — 4-up stat grid on a dark glass band:
   - Active learners, lessons completed, daily streaks kept, AI conversations.
   - Each tile = glass card with display-2 number + caption + tiny sparkline-style accent bar.

5. **What we believe** — 6 value cards in a `grid-bento` / 3-col responsive grid:
   - "Small daily wins beat big bursts."
   - "AI should teach, not replace teachers."
   - "Learning must feel calm, not anxious."
   - "Every learner deserves a guide."
   - "Mother-tongue first."
   - "Skills > certificates."
   - Each card: glass surface, icon (lucide), short title, 1–2 sentence body.

6. **How ASIKON works** — 3-step horizontal flow (numbered glass tiles with hairline connector):
   - 1. Tell us your goal • 2. Get a daily mission • 3. Learn, build, repeat.

7. **The team / built in Bangladesh** — editorial band:
   - Headline + short paragraph about being built locally for global learners.
   - Avatar row (placeholder circles for now, using existing avatar component).

8. **Closing CTA band** — aurora gradient strip:
   - Big display-2: "Your future self starts today."
   - Single primary CTA → `/onboarding`.

## Files

- **Edit** `src/pages/About.tsx` — replace contents with the new layout described above; keep `AppLayout` wrapper, use `Reveal` for scroll-in animation per section.
- **Create** `src/components/about/AboutHero.tsx` — hero band with stat chips.
- **Create** `src/components/about/AboutStats.tsx` — 4-up stat grid.
- **Create** `src/components/about/AboutValues.tsx` — 6 value cards.
- **Create** `src/components/about/AboutSteps.tsx` — 3-step "how it works".
- **Create** `src/components/about/AboutCTA.tsx` — closing CTA band.
- **Reuse** `MissionVision`, `PageSection`, `SectionHeader`, `SplitLayout`, `Reveal`, `Card`, `Button`.

## Design / technical notes

- All colors via existing HSL semantic tokens — no raw colors.
- Reuse `aurora-bg`, `glass`, `eyebrow-bar`, `display-1`, `display-2`, `body-lg`, `container-editorial`, `hairline-bottom`, `divider-soft`, `hover-lift`.
- Typography: Space Grotesk for display headlines, Inter for body.
- Fully responsive: mobile = single-column stacked, `lg+` = magazine/split layouts. Cap content at 1440 via `container-editorial`.
- Stats and team numbers are static/marketing copy (no backend wiring).
- SEO: single `<h1>` in hero, descriptive title + meta description, semantic `<section>` per band.
- Animation: `Reveal` per section, subtle hover-lift on cards. No new dependencies.

## Out of scope

- Backend, CMS, real team data, i18n translations, new routes.
- Changes to navigation/sidebar (the `/about` route already exists).

Ready to implement on approval.
