# Product Details Page — Improvement Plan

## Root cause of "Product not found"

`useProduct(slug)` in `src/hooks/useProducts.ts` only queries the Supabase `products` table. That table isn't provisioned (console shows `[useProducts] Using seed catalog — products table not provisioned`), so the list pages fall back to `mockProducts` but the **detail page returns `null`** and renders the empty state.

The list builds slugs as `product-${p.id}` (e.g. `product-1`), and `Shop` links go to `/product/<slug>`, so every storefront click currently dead-ends on "Product not found".

## Plan

### 1. Fix the data layer (the actual bug)
- In `useProduct`, mirror the list-hook pattern: if the Supabase query errors with `PGRST205` (or returns nothing), look the slug up in the `fallbackProducts` array derived from `mockProducts`.
- Match by `slug` first, then by `id` as a safety net (older bookmarks).
- Return `null` only when both sources miss, so the empty state is truly "unknown slug" not "no backend".

### 2. Improve the empty state itself
Replace the bare "Product not found / Back to shop" block with:
- A friendlier headline + sub-copy explaining the item may have been removed.
- Two CTAs: **Back to Shop** and **Browse Featured**.
- A small "You might like" strip rendering 4 items from `useProducts({ featured: true, limit: 4 })` so the page is never a dead end.
- Keep `<SEO>` with `noindex` on this state so 404-ish pages don't pollute search.

### 3. Polish the loaded details page
- **Trust row under the price**: Instant Access · Secure Checkout · 7-day Money-back (reuse existing trust tokens, digital-first per project memory — no shipping copy).
- **Sticky CTA correctness**: hide size/color selectors when `isCourse || isBook || kind ∈ {ebook,bundle,service,course}` (today they always render for non-course/book — wrong for `service`/`bundle`).
- **Gallery**: filter out falsy entries before rendering (current `[product?.image_url]` can become `[undefined]`), and add keyboard arrow navigation on the main image.
- **Related products**: pass `excludeKinds` consistent with Shop, and exclude the current product id from the strip.
- **Breadcrumb**: show on mobile too (currently `hidden lg:inline-flex`), using shorter `Shop ›  {category}` form.
- **Skeleton parity**: extend the loading skeleton to match the new layout (price, trust row, CTA) so there's no layout shift.

### 4. Tests
- `useProduct` fallback: returns the seeded product when Supabase responds `PGRST205`, by slug and by id; returns `null` for unknown slugs.
- `ProductDetail` empty state: renders friendlier copy, both CTAs, and the "You might like" strip; sets `noindex`.
- `ProductDetail` loaded: size/color selectors are not rendered for `kind: "service"` and `kind: "bundle"`; trust row is present; related strip excludes the current product.

## Files to touch

- `src/hooks/useProducts.ts` — add fallback inside `useProduct`.
- `src/pages/ProductDetail.tsx` — empty state, trust row, selector gating, gallery guard, related filter, mobile breadcrumb, skeleton.
- `src/components/SEO.tsx` — only if `noindex` prop isn't already supported (verify, add if missing).
- `src/test/product-detail-fallback.test.tsx` (new) — hook + page tests above.

## Out of scope
- No schema changes / no provisioning of the `products` table (project runs on the seed catalog by design right now).
- No changes to cart, checkout, or pricing logic.
