
# UI/UX Quality Improvement Plan

Goal: lift ASIKON's frontend from "feature-complete" to "premium, trust-first, delightful" — without changing business logic.

## 1. Design system tightening (foundation)
- Audit `index.css` + `tailwind.config.ts`: enforce all colors as HSL semantic tokens, remove ad-hoc `text-white`, `bg-black`, `text-gray-*` usages across components.
- Define a richer token set: `--surface`, `--surface-elevated`, `--border-subtle`, `--ring-focus`, `--gradient-brand`, `--shadow-glass-sm/md/lg`, `--radius-card`.
- Typography scale: lock Inter (body) + Space Grotesk (display), define `text-display`, `text-h1..h4`, `text-body`, `text-caption` utilities with consistent line-height + tracking.
- Spacing rhythm: standardize section padding (`py-12 md:py-20`), card padding, and grid gaps.
- Single source of truth for the "liquid glass" surface — one `.glass` / `.glass-elevated` utility instead of repeated inline blur/opacity classes.

## 2. Navigation & information architecture
- Sidebar: collapse rarely-used items into a "More" group; add active-state affordance (gradient bar + icon fill).
- Mobile bottom nav: keep to 5 items max (Home, Shop, Learn, Community, Profile), with center FAB for Create.
- Global search: persistent top-bar entry on desktop; on mobile, keyboard `enterkeyhint="search"`, autofocus on open, swipe-down to close, recent + trending chips.
- Breadcrumbs on deep pages (ProductDetail, LessonDetail, ContentDetail, admin).

## 3. Home & landing polish
- Hero: stronger value prop (one line), trust strip directly under CTA (COD, Verified buyers, Made in BD), animated gradient.
- Section rhythm: alternate dark/elevated surfaces, consistent "section header" component (eyebrow + title + link).
- Carousels: snap scrolling, peek next card on mobile, visible scrollbar-less indicators, keyboard arrows.

## 4. Shop & product experience
- Product card: unified aspect ratio, price prominence, badge stack (COD, Verified, New, Bestseller) with consistent color semantics.
- Filters: sticky filter chips on mobile, "active filters" pill row with one-tap clear.
- Empty/loading: skeletons matching final layout (not generic spinners), friendly empty illustrations.
- ProductDetail: sticky add-to-cart on mobile, image zoom, trust block, reviews summary above the fold.

## 5. Learn & AI tutor
- Chat UI: message grouping, streaming indicator, copy/regenerate per message, suggested follow-ups, code block syntax highlight.
- Lessons: reading progress bar, "next lesson" sticky footer, estimated read time.
- Tracks/Courses: progress rings on cards, resume button.

## 6. Community
- Feed cards: clearer author + verified-buyer badge hierarchy, media-first layout, double-tap like, comment count tap target ≥44px.
- Composer FAB: micro-animation on open, content-type quick picker.
- Infinite loop: subtle "you've seen everything — looping" toast on first wrap.

## 7. Mentorship
- Mentor card: photo, rating, specialty chips, "Join waitlist" primary CTA with count of people waiting (social proof).
- Waitlist sheet: 2-step (child age → goal), progress dots, success state with share CTA.

## 8. Forms, auth, checkout
- Inputs: floating labels or consistent label-above pattern, inline validation, clear error tokens.
- Auth: single-field OTP with auto-advance, paste-detect, resend timer.
- Checkout: 3-step stepper, address autocomplete (BD divisions/districts), COD reassurance copy, order summary sticky on desktop.

## 9. Motion & micro-interactions
- Standardize on existing `animate-fade-in`, `scale-in`, `slide-in-right` utilities; remove one-off durations.
- Page transitions: 200ms fade for route changes (already have `transitions/` folder — wire consistently).
- Tap feedback: subtle scale-95 on press for primary buttons and cards.
- Toasts: top-center on mobile, bottom-right desktop, with icon + action.

## 10. Mobile-first refinements (current viewport is 390px)
- Tap targets ≥44×44 everywhere (audit icon-only buttons).
- Use `h-dvh` not `h-screen`; safe-area insets for bottom nav.
- Sheets instead of dialogs for primary mobile actions.
- Reduce horizontal padding wastage; full-bleed images where appropriate.

## 11. Accessibility (WCAG AA)
- Run axe on Home, Shop, ProductDetail, Learn, Community, Checkout.
- Fix contrast on glass surfaces (especially muted text).
- `aria-label` on every icon-only button (search, FAB, close, like).
- Visible `focus-visible` ring using `--ring-focus`.
- Single `<main>` per route; correct heading order.

## 12. Performance perception
- Skeletons for all async sections (replace spinners).
- LCP image preload on Home + ProductDetail.
- Image: `loading="lazy"`, `decoding="async"`, `aspect-*` wrappers to prevent CLS.
- Optimistic UI for like, wishlist, cart-add.

## 13. Empty states, errors, onboarding
- Friendly empty states with illustration + primary action for: empty cart, empty wishlist, no orders, empty feed, no search results.
- First-run 4-step tour on Home (Learn / Shop / Community / Mentorship), dismissible, stored in `localStorage`.
- ErrorBoundary: branded fallback with "Reload" + "Report".

## Technical notes
- New files: `src/components/ui/section-header.tsx`, `src/components/ui/empty-state.tsx`, `src/components/ui/skeleton-card.tsx`, `src/components/onboarding/FirstRunTour.tsx`.
- Token changes in `src/index.css` + `tailwind.config.ts`.
- No schema, no business logic, no route changes.
- Suggested deps (optional): `vaul` (already common for sheets), `cmdk` (search palette desktop).

## Suggested execution order
1. Design tokens + typography + glass utility (foundation — unblocks everything)
2. Shared primitives: SectionHeader, EmptyState, SkeletonCard, sticky CTAs
3. Home + Shop + ProductDetail polish
4. Learn (chat + lessons) polish
5. Community + Mentorship polish
6. Forms / Auth / Checkout
7. Motion pass + a11y audit + onboarding tour

Tell me which phases to run first (or "all in order") and I'll start with phase 1.
