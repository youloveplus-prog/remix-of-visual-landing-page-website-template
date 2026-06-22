## Goal

Add a `/resources` page to Asikon that mirrors the structure of the AI Surfer resources page (featured event hero → search + tag filter → "Trending" rail → "Most Recent" grid → detail page) while staying inside our warm cream + indigo Noto identity. No red, no purple-on-black.

## Page anatomy

```text
+--------------------------------------------------------------+
| AppLayout (existing sidebar + header)                        |
|                                                              |
|  [ FEATURED EVENT CARD ]                                     |
|   • "Free live event" eyebrow                                |
|   • Title + date + 4-cell live countdown (Days/Hrs/Mins/Sec) |
|   • Body copy + primary CTA "Secure your free seat"          |
|   • Soft indigo glow on cream surface, rounded-bento 24px    |
|                                                              |
|  [ SEARCH BAR ] icon + "Search resources…"                   |
|                                                              |
|  [ TAG CHIPS ]   AI Tools · Free Tools · Tutorial · …        |
|   (horizontal wrap, multi-select, sticky on scroll)          |
|                                                              |
|  ── Trending tools. ──────────────────────────────────────── |
|  [ horizontal carousel of cards w/ "TRENDING" pill ]         |
|                                                              |
|  ── Most recent updates. ─────────────────────────────────── |
|  [ responsive grid 1 / 2 / 3 / 4 cols, infinite-loop scroll ]|
+--------------------------------------------------------------+
```

Card = 4:5 cover image · category pill top-left · title (Noto Serif Display, 600) overlaid on a soft cream-to-shadow gradient · tiny meta line (Noto Sans Mono caps). Hover lifts the card 4px + grows the cover image 3%.

Detail route `/resources/:slug` reuses `MobilePage`: hero image, title, byline, category chips, long-form content (markdown), "Related resources" rail at the bottom.

## Design commitments (no AI-Surfer red/black)

- Surface: warm cream `#faf6ef` background, `#fff8ec` cards, indigo `#3b4fe0` accent.
- Featured event card uses an indigo radial glow + subtle "confetti" SVG sparkles, not red.
- Countdown digits are Noto Serif Display 700 on white tiles, label is Noto Sans Mono 11px caps.
- Category pills follow existing chip surfaces (butter / lavender / mint) rotated per tag.
- Dark theme: pure black bg with indigo glow — same component, different tokens.

## Data model

Single seed file `src/data/resources.ts` for the first ship — keeps it static, fast, and easy to edit. Shape:

```ts
type Resource = {
  slug: string;
  title: string;
  cover: string;          // image URL or imported asset
  category: string;       // e.g. "AI Tools"
  tags: string[];         // for chip filter
  trending: boolean;
  publishedAt: string;    // ISO — drives "most recent"
  excerpt: string;
  body: string;           // markdown for the detail page
  ctaUrl?: string;        // external link if applicable
};
```

The page reads from this array; later we can swap to a Supabase `resources` table behind the same hook without touching components.

## Routing & nav

- New route `/resources` → `src/pages/Resources.tsx`
- New route `/resources/:slug` → `src/pages/ResourceDetail.tsx`
- Both lazy-loaded in `src/App.tsx`
- Add a "Resources" entry to the sidebar / bottom-nav map
- SEO: `<SEO>` with title "Resources — Asikon", description, OG image = featured event cover
- Sitemap: extend `scripts/generate-sitemap.ts` to emit `/resources` and each `/resources/:slug`

## Components to add

```text
src/components/resources/
  FeaturedEventCard.tsx     // hero with countdown + CTA
  CountdownClock.tsx        // 4-cell live countdown, reduced-motion safe
  ResourceSearchBar.tsx     // icon input, debounced
  ResourceTagBar.tsx        // multi-select chip filter (sticky)
  ResourceCard.tsx          // cover + pill + title + meta
  ResourceCarousel.tsx      // embla rail for "Trending"
  ResourceGrid.tsx          // responsive grid + infinite-loop hook
```

Reuses: `embla-carousel-react`, existing `useInfiniteScroll`, `Skeleton`, `MobilePage`, `AppLayout`, chip surface utilities.

## Filtering behavior

- Search: case-insensitive match across `title` + `excerpt` + `tags`.
- Tags: multi-select OR within the chip bar; combined with search via AND.
- Trending rail is unfiltered (curated). Grid below respects search + tags.
- Empty state: friendly Noto Serif Display headline + "Clear filters" link.

## Detail page

- Breadcrumb: Home › Resources › Title
- Hero cover (4:5 on mobile, 21:9 on desktop)
- Title + category chip + published date
- Markdown body rendered with the existing `react-markdown` chunk
- "Related resources" = same-category, exclude self, limit 6, horizontal rail

## Technical notes

- Countdown uses one `setInterval(1000)` with `requestAnimationFrame` guard; pauses when `document.hidden`; respects `prefers-reduced-motion` by hiding the ticking pulse but still updating the digits.
- All components are presentational; data is loaded via a single `useResources()` hook returning the static array (easy to swap for a query later).
- No backend, no auth changes, no new dependencies.
- Tests: add a smoke test that `/resources` renders the featured card + at least one resource card, and that `/resources/:slug` resolves a known seed slug.

## Out of scope (call out so we don't drift)

- No CMS / admin editor for resources yet
- No comments, likes, or saves on resource detail
- No purchase flow — these are free reads
- No email capture form on the featured card (CTA links out)

## Open questions (answer before build)

1. Featured event content: should it point to an existing Asikon course/landing, or do you want a placeholder "Asikon Live" event with editable date?
2. Sidebar placement: between "Learn" and "Community", or under "About"?
3. Initial seed: ship with 12 example resources I draft (AI tools, prompts, tutorials matching Asikon's voice), or do you have a list?
