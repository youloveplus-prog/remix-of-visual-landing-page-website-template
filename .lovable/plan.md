# Align & balance ImageTextRow card layout

The card UI works but feels boring: media half is fully filled but copy half has cramped padding and no visual rhythm to mirror the image. Both halves should feel intentional and matched, and the reverse variant should be visually identical (mirrored only).

## Changes — `src/pages/About.tsx` `ImageTextRow`

**Equal-height + matched padding**
- Force both halves to identical height with `lg:grid-cols-2 lg:items-stretch` and `lg:min-h-[560px]`.
- Copy side padding mirrors media via `p-6 sm:p-10 lg:p-14 xl:p-16` and uses `flex flex-col justify-center` so headline anchors to vertical center regardless of body length.
- Eyebrow always top-aligned in a small fixed area, body capped `max-w-[42ch]` so copy column never feels too wide on xl.

**Mirrored reverse (true symmetry)**
- Replace fragile `lg:[&>*:first-child]:order-2` with explicit `order` classes on each child driven by the `reverse` prop. Media gets `lg:order-1` / `lg:order-2`, copy gets the inverse — guarantees identical structure regardless of direction.
- Brand glow flips side too: positioned `top-right` when image is on left, `top-left` when reversed, so the warm halo always sits behind the copy column.
- Hairline top spans full card width with consistent `left-10 right-10` insets.

**Visual rhythm inside copy half**
- Add a small decorative element above the eyebrow: a 28px brand-gradient bar (matches `eyebrow-bar` accent) for visual weight balancing the image.
- Inline meta row below body: tiny dot-separated chips (e.g. "AI-powered · Bangla-first · Always on") rendered from a new optional `meta?: string[]` prop. Each ImageTextRow call passes 2–3 short tags so the copy side has the same visual density as the photo side.
- "Learn more" chip aligned to the same horizontal axis as the eyebrow on desktop (center on mobile).

**Responsive polish**
- Mobile (<640): media `aspect-[4/5]`, copy `p-6`, center-aligned, full-width.
- Tablet (640–1024): media `aspect-[16/10]`, copy `p-10`, still stacked, center-aligned.
- Desktop (≥1024): true 50/50 side-by-side, left-aligned copy, mirrored on reverse, `min-h-[560px]`, `xl:min-h-[600px]`.
- Card max width tightened to `max-w-[1180px]` so it doesn't sprawl on wide screens.

**Pass meta tags from About page**
- Three `<ImageTextRow>` callsites get a `meta` prop:
  - calm classroom → `["5 min lessons", "No streaks", "Daily mission"]`
  - patient tutor → `["AI tutor", "Bangla-aware", "Mentors on tap"]`
  - made in BD → `["Dhaka-built", "For everyone", "Open source"]`

## Out of scope

- No new images, no copy rewrites beyond meta tags.
- Other sections (Bento, Showcase, Story, Principles, Testimonials, Hero, CTA) unchanged.
