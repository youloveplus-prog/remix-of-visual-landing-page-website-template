# Fix the 3 partial checklist items

Targets: **Hierarchy**, **Imagery**, **Motion** — all converge on the home hero, which is currently a thin headline floating in cream with a huge dead gap before the logo strip.

## 1. Rebuild the home hero (Hierarchy + Imagery)

File: `src/components/home/` (the hero section) and/or `src/pages/Index.tsx`.

Replace the centered-text-only hero with a two-column bento on desktop, stacked on mobile:

```text
┌─────────────────────────────┬──────────────────────────┐
│  eyebrow chip               │                          │
│  Learning,                  │   hero visual            │
│  re-imagined.               │   (image + floating      │
│  one-line subhead           │    stat tiles)           │
│  [Start free] [Browse]      │                          │
│  ▸ 12,400 learners · 4.9★   │                          │
└─────────────────────────────┴──────────────────────────┘
```

Concrete changes:
- Add eyebrow chip ("AI learning · built in Bangla & English") above headline.
- Compact headline block, add subhead + two CTAs (primary "Start free", secondary "Browse courses").
- Inline social proof row directly under CTAs (avatar stack + rating).
- Right column: hero image (reuse the laptop-learner shot from the carousel, or generate a new warm-toned one). Overlay two floating bento tiles — "1-on-1 mentor available" and "Live AI tutor" — for depth.
- Pull the logo strip up to sit immediately below the hero (no empty band).

Result: zero dead vertical space, clear F-pattern hierarchy (eyebrow → headline → subhead → CTA → proof), real imagery in view above the fold.

## 2. Signature motion (Motion)

Use existing `motion/react` patterns; no new deps.

- Hero headline: word-by-word fade-up on mount (200ms stagger).
- Hero image: subtle parallax on scroll (use existing `useScrollParallax` hook).
- Floating bento tiles: gentle float loop (translateY 0 → -6px → 0, 4s ease-in-out infinite, offset between the two tiles).
- Logo strip: keep existing marquee, slow it slightly and add edge-fade masks.
- Trust strip cards: reveal-on-scroll using existing `Reveal` component (already in `src/components/transitions/Reveal.tsx`).

These layer to give the page one signature moment (hero word reveal + tile float) without overdoing it.

## 3. Hero asset

Generate one warm-toned hero image (cream/indigo palette, learner-at-laptop or open notebook scene, square 1024×1024) and save to `src/assets/hero-home.jpg`. Import it directly into the new hero component.

## Out of scope

- No backend changes.
- No new routes.
- No changes to auth page, shop, or other already-passing surfaces.
- No new fonts, color tokens, or design-system edits.

## Files touched

- `src/components/home/<HeroSection>.tsx` (rewrite hero block)
- `src/pages/Index.tsx` (only if logo strip placement needs adjusting)
- `src/assets/hero-home.jpg` (new)
- Possibly `src/components/transitions/Reveal.tsx` consumers (add reveal to trust strip — additive)

After: re-screenshot home desktop + mobile and confirm no dead space, hero image visible above the fold, motion triggers on load.
