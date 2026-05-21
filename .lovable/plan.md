# Home Page — Slimmer Hero + Section Polish

## 1. Hero carousel — shorter + smaller indicators
`src/components/carousels/HeroCarousel.tsx`
- Reduce slide height: change aspect from `aspect-[5/4] sm:aspect-[16/9] md:aspect-[21/9]` → `aspect-[16/10] sm:aspect-[21/9] md:aspect-[24/8]`. On 393px viewport this drops the hero from ~314px to ~245px tall.
- Indicator strip: shrink dots from `h-1` and `w-40` track to `h-[3px]` with `w-28 sm:w-32`, tighter `gap-1`, and softer `bg-foreground/15` rail. Active fill keeps the `gradient-primary`.
- Move indicators to bottom-center on mobile (cleaner), bottom-left on `sm+`.
- Tighten text block padding `p-4 sm:p-5 md:p-6` and headline sizes `text-lg sm:text-2xl md:text-3xl` so copy fits the shorter frame.
- Soften border to `border-primary/15` and reduce shadow intensity for a calmer look.

## 2. Section polish (consistent rhythm, lighter chrome)
- **Quick actions / Quick categories** (`Index.tsx`): unify card radius to `rounded-2xl`, border `border-border/50`, hover `border-primary/30`. Drop the gradient noise on quick-category tiles in favor of a single subtle `glass` surface with primary-tinted icon chip.
- **Section headers** (`src/components/ui/section-header.tsx` — verify, no behavior change): ensure `text-base sm:text-lg` weight 600 with `text-muted-foreground` "View all" link + chevron. Add 4px top accent bar option used by hero-adjacent sections only if already supported; otherwise leave.
- **Product carousels** (`ProductCarousel`): confirm card gap `gap-3`, snap alignment start, and edge fade on mobile (already wired via `MobileScroller`). Tighten title row spacing `mb-2.5`.
- **HowItWorks / WhyTrust / Testimonials / Faq / FinalCta**: standardize card padding `p-4`, icon chip `w-9 h-9 rounded-xl`, body copy `text-[13px] leading-relaxed text-muted-foreground`. Remove any double borders (border + ring).
- **MobilePage spacing**: reduce vertical rhythm from `space-y-5` → `space-y-4` on mobile so the page feels denser and the slimmer hero doesn't leave a gap.

## 3. Visual polish pass
- Replace any remaining hard `bg-card` blocks in home sections with the existing `glass` utility for consistency with the new header / bottom-nav liquid glass.
- Ensure all interactive tiles have `pressable focus-ring` and `transition-colors`.
- No new colors — reuse semantic tokens already in `index.css`.

## Out of scope
- No data, routing, or business-logic changes.
- Admin home-sections schema untouched.
- No new dependencies.
