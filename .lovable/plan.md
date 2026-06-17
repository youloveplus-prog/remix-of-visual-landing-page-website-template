# Product Details UI/UX Enhancement

Goal: make `/product/:slug` feel decisive, trustworthy, and fast — without changing data, pricing, or checkout logic.

## What changes (by zone)

### 1. Hero / above-the-fold
- Replace single image block with a **two-pane hero**: sticky media gallery on the left (desktop) and a focused "decision card" on the right.
- Media gallery upgrades:
  - Thumbnail rail with keyboard arrows + swipe on mobile.
  - Zoom-on-hover (desktop) and pinch-zoom modal (mobile).
  - Video thumbnails marked with a play glyph; auto-pause when out of view.
  - Subtle skeleton + blur-up while images load.
- Decision card (right):
  - Eyebrow chip: kind (Course / eBook / Bundle…) + verified badge.
  - H1 title in display font, one-line brand + rating + review count, last-line stock/seat status.
  - Price block with original price, % saved, and a small "lifetime / instant access" microcopy.
  - Primary CTA (kind-aware) + secondary outline (Add to wishlist / Share).
  - Trust strip directly under CTA: Instant access · Money-back · Secure checkout.

### 2. Sticky context bar
- On scroll past the hero, a slim **sticky sub-nav** appears with: title, price, and CTA, plus jump links (Overview · Curriculum · Reviews · FAQ).
- On mobile, replaces the current `StickyActionBar` with a single-row CTA + price + wishlist icon, safe-area aware.

### 3. Content sections (tabs → anchored sections)
- Convert content into clearly separated `DetailSection`s with anchor IDs matching the sticky sub-nav.
- For courses: redesigned **Curriculum** as collapsible modules with lesson count, duration, and a "preview" indicator on free lessons.
- "What you'll learn" → 2-column bullet grid with check glyphs.
- Instructor / Creator card with avatar, short bio, stats (students, courses, rating).

### 4. Social proof
- Reviews: summary block (avg rating, distribution bars, verified-buyer count) + filter chips (5★, with photos, verified).
- Add a lightweight "X people viewed this today" line driven by the existing impression analytics — no new tables.

### 5. FAQ + closing
- FAQ accordion with smoother open/close animation and "Still have questions?" CTA linking to support.
- Related products carousel polished: same card refinements already in `ProductCard`.

### 6. Empty / loading / not-found
- Skeleton mirrors the new two-pane layout so the page doesn't reflow on load.
- Keep the existing not-found focus-management fix; restyle to match the new visual language.

## Accessibility & performance
- Every interactive element keyboard-reachable; visible focus rings using existing tokens.
- `aria-current` on active sub-nav anchor; `aria-expanded` on accordions.
- Respect `prefers-reduced-motion` — disable parallax/zoom transitions.
- Lazy-load below-the-fold sections (reviews, FAQ, related) with `IntersectionObserver`.
- Preload the primary hero image; defer gallery thumbnails.

## Design tokens (no hardcoded colors)
- Reuse `--primary`, `--card`, `--muted`, `--border`, `--ring`.
- Add two semantic helpers in `index.css` if missing: `--surface-trust` (soft mint tint) and `--surface-price` (warm cream) — both as HSL.
- Typography: Plus Jakarta Sans for headings/body, Departure Mono for eyebrows/labels — already in the system.

## Technical notes
- All work stays in `src/pages/ProductDetail.tsx` and small new pieces under `src/components/product/`:
  - `ProductHero.tsx` (media + decision card)
  - `ProductStickyNav.tsx`
  - `ProductCurriculum.tsx` (collapsible)
  - `ReviewSummary.tsx`
- No schema, no API, no routing changes. `useProduct` hook unchanged.
- Reuses existing `DetailSection`, `Button`, `Badge`, `StickyActionBar` primitives.
- Animations via Framer Motion (already in deps) — fade/slide only, no layout thrash.

## Out of scope
- Cart/checkout flow changes.
- New backend tables or edge functions.
- Variant/size logic for non-apparel products.

## Suggested build order
1. New `ProductHero` (media gallery + decision card) + skeleton parity.
2. Sticky sub-nav + anchored sections.
3. Curriculum accordion + "what you'll learn" grid + instructor card.
4. Review summary + filter chips.
5. FAQ polish + related carousel pass.
6. Motion + reduced-motion + a11y sweep.

Want me to proceed with this plan, or adjust scope (e.g. skip the sticky sub-nav, or focus on mobile only)?