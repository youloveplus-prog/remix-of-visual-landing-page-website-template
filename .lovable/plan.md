# Convert ImageTextRow sections to a card UI

The three alternating image+text sections on `/about` currently use a split 12-col layout with floating image and floating text — lots of empty space on desktop. Wrap each one in a single liquid-glass card so the image and copy live inside one rounded container.

## Changes

**File:** `src/pages/About.tsx` → `ImageTextRow` component

- Wrap Media + Copy in one `glass-strong` card: `rounded-[2rem]`, `border border-white/10`, subtle inner ring, hairline top gradient, optional brand-glow blob behind, `overflow-hidden`.
- Card spans `max-w-6xl mx-auto` inside the section so it doesn't bleed the full container.
- Internal grid: `grid lg:grid-cols-2` (50/50) instead of 7/5 asymmetric — image one half, copy other half, both flush to card edges.
- Image: fills its half edge-to-edge, `aspect-[4/5]` mobile, `lg:aspect-auto lg:h-full lg:min-h-[520px]`, no separate rounded corners (card clips).
- Copy: padded `p-7 sm:p-10 lg:p-14`, vertically centered (`flex flex-col justify-center`), keeps eyebrow + h2 + body, adds a small ghost CTA chip ("Learn more →") for card affordance.
- `reverse` flips the order on desktop via `lg:[&>*:first-child]:order-2`.
- Mobile: stacks image on top, copy below, both inside the same card.
- Section wrapper padding stays but reduces lg max width since the card itself carries the visual weight.

## Out of scope

- Hero, Stats, BentoGallery, EndlessShowcase, Principles, Testimonials, Story, FinalCTA — unchanged.
- No new images, no copy changes.
