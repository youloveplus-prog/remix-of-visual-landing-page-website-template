# Expand the Higgsfield-style home with app-specific sections

Add more sections that map to ASIKON's actual surfaces (courses, AI tutor, mentorship, community, game, resources, trust). Keep the dark Higgsfield aesthetic and the scoped `.home-higgsfield` wrapper. No backend changes.

## New section order

```text
1.  NeonPromoTicker            (existing)
2.  FeaturedMediaRow           (existing — 4 hero tiles)
3.  ToolsBentoGrid             (existing — 9 surfaces)
4.  LiveStatsBar               NEW  ·  learners / lessons / courses / coins ticker
5.  TrendingRail "Trending"    (existing)
6.  CategoryShelf              NEW  ·  AI · Python · Design · Business · Kids chips → /shop
7.  TracksSection              NEW  ·  3 learning tracks with progress bars
8.  AiTutorTeaser              NEW  ·  big dark panel, sample chat bubbles, "Ask now" CTA
9.  TrendingRail "New"         (existing)
10. MentorshipSpotlight        NEW  ·  3 mentor cards + "Join waitlist" pill
11. ResourcesRow               NEW  ·  guides / events / countdown clock
12. GameTeaser                 NEW  ·  earn-coins panel + leaderboard top 3
13. CommunityStrip             (existing) → upgraded to live posts mini-grid
14. TestimonialsMarquee        NEW  ·  scrolling reviews with avatar + rating
15. TrustStrip                 NEW  ·  Instant access · Secure checkout · Money-back · Verified buyers
16. PartnerLogos               NEW  ·  dark partner/brand strip
17. FaqAccordion               NEW  ·  6 questions (also feeds JSON-LD for SEO)
18. HomeCtaPanel               (existing — final lime CTA)
```

## New components (`src/components/home/higgsfield/`)

1. **LiveStatsBar.tsx** — 4 big numbers with tiny uppercase labels; thin top/bottom borders. Pulls from a small counts hook (mocked if not wired).
2. **CategoryShelf.tsx** — horizontal chip rail of categories; each chip links to `/shop?category=...`. Reuses `useCategories`.
3. **TracksSection.tsx** — 3 cards, each shows track name, lesson count, neon progress bar; links to `/track/:slug`. Uses `useTracks`.
4. **AiTutorTeaser.tsx** — split layout: left = fake transcript bubbles; right = neon "Ask the tutor" button → `/learn`.
5. **MentorshipSpotlight.tsx** — 3 mentor cards (image, name, subject, "Waitlist" pill). Uses `useMentors` with fallback.
6. **ResourcesRow.tsx** — 4 tiles: featured event with countdown + 3 resource cards. Uses `src/data/resources.ts`.
7. **GameTeaser.tsx** — 2-col panel: left = "Earn 100 coins/day" CTA → `/game`; right = mini leaderboard (top 3 with crown icons).
8. **TestimonialsMarquee.tsx** — two reverse-direction rows of review cards (avatar, ⭐⭐⭐⭐⭐, 1-line quote, verified badge).
9. **TrustStrip.tsx** — 4 icon + label cells on hairline border row.
10. **PartnerLogos.tsx** — grayscale logo grid that lifts to white on hover.
11. **FaqAccordion.tsx** — shadcn Accordion styled dark; emits FAQ JSON-LD via `<script type="application/ld+json">`.

## Visual rules (consistent with current home)

- Background pure black, cards `bg-neutral-950` + `border-white/10`, radius `10–12px`.
- Section heading pattern: `font-display text-2xl/3xl`, small uppercase tracked label or "View all →" link on the right.
- Single neon accent `hsl(var(--hf-accent))` only on CTAs, active states, and progress bars.
- Each section: `pt-10`, full-bleed inner padding `px-4 sm:px-6 lg:px-8`.

## Index.tsx changes

- Insert the 11 new components in the order shown above; keep existing data hooks; lazy-mount the heavy ones (`TestimonialsMarquee`, `FaqAccordion`, `MentorshipSpotlight`) behind `LazyMount` to protect first paint.
- Move the existing JSON-LD FAQ from the old `Index.tsx` into `FaqAccordion.tsx` so the same questions render and emit structured data.

## Data sources reused

`useFeaturedProducts`, `useProducts`, `useCategories`, `useTracks`, `useMentors`, `useHomeSections`, `src/data/resources.ts`, mock testimonials from `src/lib/mock-data.ts`.

## Out of scope

- No header/footer/auth/admin changes.
- No new tables, edge functions, or migrations.
- Light theme stays disabled.

## Verification

- Build green, 181 tests still pass.
- `/` shows all sections, lazy ones fade in on scroll.
- Lighthouse LCP not regressed (lazy-mount keeps initial bundle small).

## Open question

Ship all 11 new sections at once, or stage in two waves: **(A)** stats + tracks + AI tutor + mentorship + game (product surfaces) → **(B)** testimonials + trust + partners + FAQ (proof + SEO)?
