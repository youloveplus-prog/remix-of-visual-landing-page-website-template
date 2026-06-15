## Button System Refresh — Plan

Refine our existing bento-soft button language across three layers: the global shadcn primitive, shop/product actions, and course-detail page buttons. Motion-enhanced (framer-motion press scale + loading state baked into the primitive). Brand stays indigo/cream; no new color hardcoding.

### 1. Global `Button` primitive — `src/components/ui/button.tsx`

Refined `cva` variants + sizes + a `loading` prop. All values reference existing semantic tokens (`--primary`, `--secondary`, `--accent`, `--muted`, `--border`).

**Variants (refined, not renamed — drop-in compatible):**
- `default` — `bg-primary text-primary-foreground`, `rounded-2xl`, soft shadow `shadow-[0_2px_0_0_hsl(var(--primary)/0.25),0_8px_24px_-12px_hsl(var(--primary)/0.45)]`, hover lifts shadow.
- `secondary` — warm-cream tile: `bg-secondary text-secondary-foreground`, `rounded-2xl`, 1px `border-border`, subtle inset highlight.
- `outline` — transparent bg, `border-border`, hover `bg-muted/60`.
- `ghost` — bg transparent, hover `bg-muted/70`, no border.
- `destructive` — `bg-destructive text-destructive-foreground`, same shape language as default.
- `link` — unchanged behavior, uses `story-link` underline animation.
- **new `chip`** — full pill: `rounded-full px-3.5 py-1.5 text-xs font-medium bg-primary/10 text-foreground` for inline filter/meta buttons (shop filters, course chips).
- **new `glass`** — `surface-panel` + backdrop blur for floating overlay actions (video controls, image overlays).

**Sizes:** `sm` (h-9 px-3 text-sm), `default` (h-11 px-4 text-sm), `lg` (h-12 px-5 text-base), `xl` (h-14 px-6 text-base font-semibold) for hero CTAs, `icon` (h-11 w-11), `icon-sm` (h-9 w-9).

**Motion-enhanced behavior (baked in):**
- Replace inner content with a `motion.span` wrapper using `whileTap={{ scale: 0.96 }}` and `transition={{ type: "spring", stiffness: 500, damping: 30 }}`. Disabled when `disabled || loading`.
- New `loading?: boolean` prop renders a `Loader2` spinner (lucide) before children, sets `aria-busy`, disables pointer events, keeps button width stable.
- Primary + destructive variants get a one-shot focus ring shimmer via Tailwind `ring-2 ring-primary/40 ring-offset-2 focus-visible:ring-offset-background`.
- Hover lift uses `transition-[transform,box-shadow] duration-200 hover:-translate-y-[1px]` (skipped on `icon` size to avoid jitter in nav rails).

**Accessibility:** keep all existing `Slot` / `asChild` behavior. Spinner has `aria-hidden`. Disabled state retains 60% opacity, cursor-not-allowed.

### 2. Course-detail page buttons — `src/components/course-detail/`

- **`CourseVideoCard`** — swap raw `<button>` elements for the new primitive:
  - Center play/pause: `<Button variant="glass" size="icon" className="w-16 h-16 rounded-2xl">` with motion press already baked in.
  - Bottom control bar play, mute, fullscreen: `<Button variant="ghost" size="icon-sm" className="text-white hover:bg-white/15">`.
  - Scrubber stays a styled `<input type="range">` (not a button).
- **`CourseMetaRow`** chips → replace handcrafted `<span>` chips with `<Button variant="chip" size="sm" disabled>` so they share the system but stay non-interactive (no hover lift on disabled).
- **`CourseDescription`** "Description ▾" dropdown trigger → `<Button variant="outline" size="sm" className="rounded-full">`.

### 3. Shop & product action buttons

- **`ProductCard` add-to-cart** (`src/components/shop/*` and `src/pages/ProductDetail.tsx`): primary CTA becomes `<Button size="lg">Add to cart</Button>`; secondary "Buy now" becomes `<Button variant="secondary" size="lg">`. Wishlist heart → `<Button variant="ghost" size="icon">`.
- **Quantity stepper** in cart/checkout: `<Button variant="outline" size="icon-sm">` for `-` / `+`, with motion press already from the primitive.
- **Shop filter pills** (mobile sheet category + sort): `<Button variant="chip" size="sm">` with `data-state="on"` styling switching `bg-primary/10` ↔ `bg-primary text-primary-foreground`.
- **`Cart` checkout CTA**: `<Button size="xl" loading={isProcessing}>Checkout</Button>` — exercises the new loading prop.

### 4. Tokens & styles (no new colors)

Confirm in `src/index.css` these tokens already exist; otherwise add as semantic vars in both light and dark blocks:
- `--button-shadow-primary` (HSL alpha layering for the primary lift shadow)
- `--button-shadow-soft` (secondary/outline subtle shadow)

If added, wire them via the `cva` strings — never inline hex.

### 5. Dependencies

`framer-motion` is already used (per CourseVideoCard / hero). No new packages.

### 6. Acceptance

- Every existing `<Button>` callsite still works (props are additive; variants are drop-in).
- New variants `chip` and `glass` available and used on course detail + shop filters.
- `loading` prop renders a spinner and disables interaction with stable width.
- Press feels tactile (spring scale) on all enabled buttons; icon nav buttons don't jitter.
- Light + dark themes pass `node scripts/audit-light-bg.js` with zero new CRITICAL hits.
- Course detail video controls, meta chips, description trigger, shop product CTAs, quantity steppers, filter pills, and checkout button all visibly share the refreshed language.
