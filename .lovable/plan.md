Refine `src/components/shop/ProductCard.tsx` (and `CourseVideoCard.tsx`) so the shop grid feels more crafted without breaking the existing warm-bento system or data shape.

## Visual upgrades

- **Layered image frame**: replace the flat `rounded-xl` image well with a soft inset ring (`ring-1 ring-border/60 ring-inset`) plus a faint top-down gradient overlay so the picture seats into the card instead of sitting flat on it.
- **Repositioned price chip**: drop the rounded-bl-2xl notch and use a true floating pill — `bg-card/95 backdrop-blur border border-border/60 shadow-sm` — anchored bottom-left of the image, so it stops fighting the wishlist heart and reads as a real tag.
- **Trust strip refinement**: keep the Zap + "Instant access · Lifetime" copy, but soften from solid `bg-primary/85` to a translucent `bg-foreground/85 text-background` gradient strip that only appears on hover (slides up). On idle the image is uninterrupted.
- **Tighter badge stack**: discount / Trending / New chips move to the bottom-left of the image, single row, with consistent pill styling. Discount badge gets a subtle indigo→indigo-glow gradient.
- **Title + CTA**: title scales up half a step on `md`, gets `tracking-tight`. The "Order Now ↗" affordance becomes an icon-only arrow button in the bottom row that fills with `bg-primary text-primary-foreground` on group-hover — keeps the title row clean.
- **Meta row redesign**: rating, verified, enrollment count consolidate into a single divider-separated micro-row above the chips (`text-[11px] text-muted-foreground` with `•` separators).
- **Hover state**: replace the `-translate-y-1 + big shadow` combo with a calmer `translate-y-[-2px]` + `shadow-[0_12px_32px_-12px_hsl(var(--primary)/0.25)]` (brand-tinted shadow). Image scales `1.04` (down from 1.05) for a more premium feel. Border tints to `border-primary/40`.

## Featured variant

The horizontal `lg:flex-row` featured layout gets a vertical brand-tinted divider between image and content, a larger price treatment, and the trust footer pinned to the bottom rather than inline.

## Scope guardrails

- No new dependencies. Pure Tailwind + existing tokens (`--primary`, `--card`, `--border`, `--foreground`, brand chip surfaces).
- No data shape changes. Same props, same `Product` type.
- Light + dark themes both verified. No hardcoded colors.
- `ProductQuickView` behavior unchanged.
- Apply the same image-frame, price-pill, and hover treatment to `CourseVideoCard.tsx` so the shop grid stays cohesive.

## Verification

After the edit, capture `/shop?type=ebooks` at desktop (1280) and mobile (375) via Playwright and confirm the grid renders without overflow or contrast regressions.