# Category-aware product CTAs

Replace the generic "Add to cart / Buy now" everywhere with a label + icon + post-purchase action that fits the product's category. The current categories drive the mapping; nothing in the database needs to change.

## CTA mapping

| Category slug   | Primary CTA      | Secondary CTA    | Icon       | After purchase            |
| --------------- | ---------------- | ---------------- | ---------- | ------------------------- |
| `courses`       | Enroll now       | Start free preview | GraduationCap | Continue learning (→ /learn) |
| `books`         | Read now         | Preview chapter  | BookOpen    | Open in reader (→ /library) |
| `prompts`       | Download pack    | Copy sample      | Download    | Download again (→ /library) |
| `ai-tutor`      | Start chatting   | Try a demo       | Sparkles    | Open AI Tutor (→ /tutor)    |
| `kits`          | Get the kit      | What's inside    | Package     | Download files (→ /library) |
| `gadgets`       | Get blueprint    | View specs       | Cpu         | Download files (→ /library) |
| _fallback_      | Get access       | Learn more       | ArrowRight  | View in library             |

Already-owned items always show **Open / Continue** instead of the purchase CTA on every surface.

## Implementation

1. **Single source of truth** — new `src/lib/productCta.ts`:
   - Exports `type ProductCtaKind` and `getProductCta(product)` returning `{ kind, primaryLabel, secondaryLabel, icon, ownedLabel, ownedHref }`.
   - Resolves from `product.category?.slug` first, then falls back to a keyword check on `category.name` / `product.name` for legacy rows (e.g. "course" in the title → courses).
   - Pure, fully unit-testable; no React imports.

2. **Reusable button** — new `src/components/shop/ProductCtaButton.tsx`:
   - Props: `product`, `variant` (`primary` | `secondary` | `compact`), optional `owned`, `onPurchase`.
   - Renders icon + label, handles owned state, forwards to existing cart / checkout handlers.

3. **Swap the call sites** (no behavior change beyond label/icon/owned routing):
   - `src/components/shop/ProductCard.tsx` — grid card primary action
   - `src/components/shop/ProductQuickView.tsx` — quick view modal
   - `src/pages/ProductDetail.tsx` — hero CTA + sticky bar
   - `src/components/ui/sticky-action-bar.tsx` — accept a `product` prop and delegate
   - `src/pages/Wishlist.tsx`, `src/pages/Learn.tsx`, `src/pages/ContentDetail.tsx`, `src/pages/TrackDetail.tsx`, `src/pages/Game.tsx` — same replacement
   - `src/components/learn/MyCoursesSection.tsx` — already owned, show "Continue learning"

4. **Owned detection** — read from the existing `useUserPurchases` / `useUserCourses` hook (whichever the page already uses). If a page doesn't have it, skip owned-state rendering for that surface (no new queries in this pass).

5. **Tests**
   - `src/lib/productCta.test.ts` — table-driven test covering each category slug, keyword fallback, and the owned override.
   - Existing `tests/visual/product-card-price.spec.py` will catch any layout drift from the new icon/label.

## Out of scope

- No new database columns or migrations — category is enough.
- No changes to checkout, cart logic, or pricing.
- No admin UI for per-product CTA override (can be a follow-up if you ever need one).

## Files touched

- add: `src/lib/productCta.ts`, `src/lib/productCta.test.ts`, `src/components/shop/ProductCtaButton.tsx`
- edit: 9 call sites listed above

Approve and I'll implement.
