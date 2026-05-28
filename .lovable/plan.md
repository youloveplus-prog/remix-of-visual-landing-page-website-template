## Scope
Refine the shop product card to match selected "Refined Editorial" direction. Change product grid to 1-col mobile / 2-col tablet / 3-col desktop (per user direction). Applies to all shop categories including Courses.

## Changes

**1. `src/index.css`** — update `.grid-products`:
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6
```

**2. `src/components/shop/ProductCard.tsx`** — refine visual styling per v1 prototype (structure unchanged, all props/handlers preserved):
- Title: `text-lg md:text-xl font-bold leading-tight font-display` (Space Grotesk)
- Price: `text-lg font-bold text-primary` (was foreground); strikethrough `text-sm`
- Discount badge: `rounded-full bg-primary text-primary-foreground uppercase tracking-wider shadow-md` (was square dark)
- Wishlist: `h-9 w-9` slightly larger, `bg-background/90 backdrop-blur-sm shadow-sm`
- Bottom row: rating left, optional category eyebrow right (`uppercase tracking-widest text-muted-foreground`)
- Padding: `p-4 md:p-5`
- Hover: `-translate-y-1` lift

All design tokens from existing HSL system — no raw colors. No behavior changes, no removed fields, no functional code touched.

## Out of scope
- ProductCarousel, compact/featured variants unchanged
- Filters, search, sort untouched
- No data model changes