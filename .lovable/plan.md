# Mobile Polish: Micro-animations, Overflow Fixes, Performance

## 1. MobileCard micro-animations (centralized)

Update `src/components/ui/mobile-card.tsx` so every card across the app gains the same tactile feel — no per-page edits needed.

- **Press feedback**: `active:scale-[0.98] active:brightness-95` + existing `.pressable`
- **Hover (desktop only)**: `md:hover:-translate-y-0.5 md:hover:shadow-lg md:hover:border-border` with `transition-[transform,box-shadow,background,border-color] duration-200 ease-out`
- **Mount/enter**: opt-in `animateIn` prop → `animate-fade-in` with a tiny stagger via inline `style={{ animationDelay }}` (used by list pages)
- **Loading**: new `loading` prop renders a glass skeleton with `animate-pulse` matching the card's shape, so pages can swap `<MobileCard loading />` instead of bespoke `<Skeleton />` blocks
- **Tap target**: GPU hint `will-change-transform` only while pressed (via `:active`) — avoids permanent compositing layers

Add a `.glass-press` utility in `src/index.css` for cards that aren't `MobileCard` (e.g. `ProfileHeader`, `HeroBanner`) so the feel is consistent.

## 2. Overflow fixes (root cause, not per-symptom)

Audit and patch the recurring offenders:

- **Global guard in `src/index.css`**: `html, body, #root { overflow-x: hidden; }` + `* { min-width: 0; }` inside `@layer base` so flex/grid children can shrink instead of pushing the viewport.
- **MobilePage**: add `min-w-0 overflow-x-clip` to the inner container; ensure `pb-[calc(72px+env(safe-area-inset-bottom))]` is applied consistently (some pages still use hardcoded `pb-24`).
- **Horizontal scrollers** (`MobileScroller`, `HeroCarousel`, `ProductCarousel`, `CategoryCarousel`, `StoryCarousel`): wrap in `overflow-hidden` parent, give track `flex` + `min-w-0`, replace any `w-screen` with `w-full`.
- **Long text**: add `truncate` / `line-clamp-*` to titles in `Orders`, `Wishlist`, `ProductDetail` cards (a few still missing), `min-w-0` on every `flex-1` sibling next to an image/avatar.
- **Profile bleed**: clamp `ProfileHeader` cover image with `max-w-full object-cover` and `overflow-hidden` on the bleed slot.
- **Tables/code blocks in Product detail**: wrap in `overflow-x-auto` containers instead of letting them bust the page.

## 3. Performance pass

- **Image hints**: add `loading="lazy"` + `decoding="async"` to every `<img>` in `Game`, `Orders`, `OrderDetail`, `Wishlist`, `ProductDetail`, `Community` card components. LCP image on `Index` gets `fetchpriority="high"`.
- **Explicit dimensions**: add `width`/`height` (or aspect-ratio classes) on course/product/avatar imgs to eliminate CLS.
- **Memoize lists**: wrap `PostCard`, `VideoCard`, `ProductCard`, `ReviewCard` in `React.memo` (they're rendered in long feeds and re-render on every parent state tick).
- **Animation cost**: keep transitions on `transform`/`opacity` only (no `width`/`height`/`top`); the `.pressable` and new MobileCard classes already comply.
- **Glass blur cost**: cap `backdrop-blur` to `backdrop-blur-md` on list cards (currently `xl` in a few places) — the blur radius dominates paint time on mid-range Android.
- **Reduce reflows**: remove unnecessary `motion.div` wrappers around list items where CSS `animate-fade-in` is sufficient.
- **Prefers-reduced-motion**: add a global `@media (prefers-reduced-motion: reduce)` block that neutralizes the new transforms.

## 4. Per-page touch-ups

Only the changes that can't be solved by the centralized MobileCard update:

- **Index**: stagger `animateIn` on hero rows; lazy-load below-the-fold sections via existing `Reveal`.
- **Game**: weekly streak cells get `transition-transform active:scale-90`; reward grid images get aspect-ratio + lazy loading.
- **Community**: tab content wrapped in `min-w-0`; feed items get `React.memo` + `animateIn` with index-based delay capped at 6.
- **Profile**: stat tiles use `MobileCard` press; tabs row gets `overflow-x-auto` with snap.
- **Orders / OrderDetail**: list items `animateIn`; skeleton swap uses new `MobileCard loading`.
- **ProductDetail**: gallery uses `aspect-square` + `object-cover` + lazy loading; sticky CTA bar already exists, ensure `min-w-0` on price/title row.

## Out of scope

- No data, hook, or routing changes
- No new dependencies (no framer-motion additions; existing `motion` usage untouched)
- Desktop (`lg+`) layouts unchanged beyond hover affordance
- No copy or icon changes

## Technical notes

- All new classes live in `MobileCard`, `MobilePage`, and `index.css` utilities — page files get tiny diffs (mostly removing ad-hoc skeletons and adding `animateIn`).
- Verification: visual check on Home/Game/Community/Profile/Orders/ProductDetail at 360px, 393px, 414px; confirm no horizontal scrollbar; check `browser--performance_profile` before/after for INP and long tasks.
