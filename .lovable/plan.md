## Goal
Push the existing `.glass` / `.glass-strong` system into true Apple-style "liquid glass" — depth, refraction, specular highlights, animated sheen — and apply it consistently across every About-page surface.

## Where it lands today
- `.glass` and `.glass-strong` are calm/flat: single highlight gradient + blur + 1px border. No edge specular, no refraction, no inner shadow, no animated sheen.
- About page surfaces using glass: ImageTextRow cards, Story sidebar, Principles cards, Testimonial cards, Mission/Vision pillars, mobile Stats cards.

## Plan

### 1. Upgrade glass tokens (one place, project-wide benefit)
File: `src/index.css`

Add three new layered effects on top of existing `.glass` / `.glass-strong` (additive — don't break other pages):
- **Edge specular**: a 1px inner top + left highlight using `inset` box-shadow with white at ~10% opacity, plus a 1px bottom-right shadow at near-black ~6% for refractive depth.
- **Inner glow**: an inset radial highlight in the top-left corner via a pseudo-element with `mix-blend-overlay` so it adapts to dark/light theme.
- **Specular sheen** (new `.liquid-glass` class): an animated diagonal highlight that drifts every 8s — masked, low opacity (~6%), respects `prefers-reduced-motion`.
- **Refraction stroke**: replace flat 1px border with a 2-color gradient border (`border-image` with top→bottom hairline) so the rim catches light.
- **Hover lift**: subtle `translateY(-2px)` + shadow swap for interactive glass surfaces. Skip on touch.

Add new utility `.liquid-glass` (extends `.glass-strong` + sheen + corner glow) and `.liquid-glass-interactive` (adds hover lift + cursor pointer affordance).

### 2. Apply consistently on the About page

| Surface | Current | New |
|---|---|---|
| Hero buttons | mixed `glass` outline + solid primary | Outline gets `liquid-glass` + subtle inner glow on hover |
| Stats mobile cards | `glass-strong` | `liquid-glass` with corner glow |
| Stats desktop hairline row | plain `border-y` | wrap in a single `liquid-glass` band so the whole strip floats |
| Mission/Vision pillars | flat gradient cards | `liquid-glass` + Bangla glyph stays; add corner specular |
| ImageTextRow article | `glass-strong` | `liquid-glass` with refraction stroke + animated sheen on the copy column only |
| Story sidebar card | `glass-strong sticky` | `liquid-glass` + brighter top-edge specular |
| Principles cards | `glass-strong` | `liquid-glass-interactive` (hover lift) |
| Testimonial cards | `glass-strong` | `liquid-glass` + soft inner glow behind the quote mark |
| BentoGallery CTA pills | solid white/neutral pills | swap to `liquid-glass` pill so they read as glass chips over the imagery |
| FinalCTA section | plain aurora bg | add a `liquid-glass` plinth behind the button group for grounding |

### 3. Polish details
- Add a single page-wide aurora layer behind the About page (fixed, very subtle, ~6% opacity) so blur surfaces have *something* to refract through. Currently large sections sit on flat bg making blur invisible.
- Ensure `backdrop-filter` fallback: solid `background` color stays readable on browsers without backdrop-filter.
- Tighten radii: glass cards stay at `rounded-2xl` / `rounded-[1.75rem]` — no change.

## Out of scope
- Copy changes
- Image regeneration
- Layout/composition changes — purely the glass treatment + hover behavior
- Other pages (utilities are upgraded globally but only About is re-skinned in this pass; other pages benefit automatically without regression because the new behavior is on a new `.liquid-glass` class, not on existing `.glass*`)

## Technical notes
- All effects via CSS — no new JS deps.
- Animated sheen uses CSS `@keyframes` + `mask-image: linear-gradient(...)`; falls back gracefully (mask-image is well-supported in modern browsers, decorative only).
- Wrap sheen + lift in `@media (prefers-reduced-motion: no-preference)`.
- Aurora background uses a single fixed `<div>` rendered inside the About page wrapper — no global change.
