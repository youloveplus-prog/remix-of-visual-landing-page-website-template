
# Connect All Pages — Cross-Linking Plan

Goal: every page in ASIKON should help the user discover the next relevant page. Today most pages are well-built but live in isolation (Shop, Learn, AI Tutor, Mentors, Resources, Community, Game, Profile). This plan stitches them together using shared components, route metadata, and a recommendation layer.

## Connection map

```text
                    ┌──────────────┐
                    │   Home (/)   │
                    └──────┬───────┘
       ┌───────────────────┼────────────────────────────────┐
       │                   │                                │
  ┌────▼────┐        ┌─────▼─────┐                    ┌─────▼─────┐
  │  Shop   │◄──────►│ Resources │◄──────►Community◄─►│   Learn   │
  └────┬────┘        └─────┬─────┘         ▲          └────┬──────┘
       │ buy/enroll        │ read          │ posts          │ topic
  ┌────▼────────┐    ┌─────▼─────┐    ┌────┴────────┐  ┌────▼──────┐
  │ ProductDet. │◄──►│ResourceDet│◄──►│   Profile   │◄►│ AI Tutor  │
  └────┬────────┘    └───────────┘    └────┬────────┘  └────┬──────┘
       │ curriculum                        │ progress        │ practice
  ┌────▼────────┐                     ┌────▼────────┐  ┌────▼──────┐
  │CourseDetail │────► LessonDetail   │   Orders /  │  │ Revision  │
  └────┬────────┘                     │  Wishlist   │  └───────────┘
       │ mentors                      └─────────────┘
  ┌────▼────────┐
  │  Mentors    │────► Mentor booking ─► Profile / Game (XP)
  └─────────────┘
```

Every arrow above becomes a concrete UI affordance (link, rail, breadcrumb, or chip).

## Phase 1 — Foundations (shared connective tissue)

Single source of truth so every page links consistently.

1. **Route map module** `src/lib/nav-map.ts` (exists — extend it).
   - Export `relatedRoutes(route)` returning the canonical "next steps" for any page (e.g. `/courses/:slug` → `[lessons, ai-tutor?topic, mentors, community]`).
   - Export `breadcrumbsFor(path, params)` for breadcrumb rendering.
2. **`<Breadcrumbs />`** in `src/components/layout/Breadcrumbs.tsx`.
   - Uses `hf-eyebrow` styling, semantic `<nav aria-label="Breadcrumb">`, JSON-LD output.
   - Drop into all detail pages: ProductDetail, CourseDetail, LessonDetail, ResourceDetail, ContentDetail, TrackDetail, OrderDetail, About, Help, Mentors.
3. **`<RelatedRail />`** in `src/components/connect/RelatedRail.tsx`.
   - Generic horizontal embla carousel that accepts heterogeneous items (course / resource / mentor / post / topic).
   - Used as the "Continue your journey" rail at the bottom of every detail page.
4. **`<CrossLinkChips />`** in `src/components/connect/CrossLinkChips.tsx`.
   - Small chip group for inline "Ask AI Tutor about this", "Discuss in Community", "Find a mentor", "Add to wishlist".

Verification: render breadcrumbs and the empty rail on one detail page (CourseDetail) and confirm tests still pass.

## Phase 2 — Global search & discovery

Make search the universal connector.

1. Expand `useGlobalSearch.ts` to index products, courses, lessons, resources, mentors, community posts, and curriculum topics. Tag every result with `kind` and `route`.
2. Promote `MobileSearchOverlay` + `SmartSearch` to the header on every page (Shop, Learn, Community, Profile, AI Tutor, Resources, Game). Keyboard shortcut `⌘K`.
3. Add a "Recent + Suggested" section to the overlay, sourced from the route map and the learner profile.
4. Add empty-state CTAs on every list page that link into search ("Can't find it? Search everything").

Verification: existing `seo-crawling`, `category-routing`, `deep-link-content-type` tests stay green; add one test that asserts a Resources hit and a Mentor hit both appear for a shared query.

## Phase 3 — Content links between pages

Wire the arrows in the diagram into real UI.

| From | To | Surface |
|------|----|---------|
| `ProductDetail` (course kind) | `CourseDetail` / `LessonDetail` | "Start learning" primary CTA + curriculum deep-links |
| `CourseDetail` | `AiTutor?topic=` | "Ask the AI Tutor about this chapter" chip per module |
| `CourseDetail` / `LessonDetail` | `Mentors?subject=` | "Book a mentor for this topic" card |
| `LessonDetail` | `Revision` | "Add to revision" + auto-suggest after completion |
| `AiTutor` thread | `ResourceDetail`, `CourseDetail` | Cited sources rendered as link chips below assistant messages |
| `Resources` / `ResourceDetail` | `Shop` / `CourseDetail` | "Buy the full course" CTA if a related product exists |
| `Community` post | `ProductDetail`, `CourseDetail`, `Profile` | Auto-link mentions and product tags |
| `Mentors` / mentor profile | `Profile` (`/profile/:userId`), `Community` | "View public profile" + "Posts by this mentor" |
| `Game` | `Profile`, `Leaderboard`, `AiTutor` | "Practice with AI Tutor" + XP linked back to Profile |
| `Orders` / `OrderDetail` | `CourseDetail` / `ContentDetail` | "Open your content" replaces "Track package" for digital items |
| `Wishlist` | `ProductDetail` | Existing — add "Similar items" rail |

Implementation: each receiving page already exists; add the `<RelatedRail />` + `<CrossLinkChips />` blocks at the bottom of the page body and wire props from the route map.

## Phase 4 — Contextual recommendations

Per-page "next step" intelligence powered by existing hooks.

1. **Hook `useRecommendations(context)`** in `src/hooks/useRecommendations.ts`.
   - Input: `{ kind, id?, topicId?, categoryId? }`.
   - Combines `useLearnerProfile`, `useEnrollments`, `useMastery`, `useProducts`, `useMentors`, `useCommunityFeed` already in the codebase.
   - Returns ordered items typed as `RailItem[]` for `<RelatedRail />`.
2. Reuse the existing `RecommendedForYou` pattern (workspace) but make it accept a `context` prop so every detail page can drop in `<RecommendedForYou context={{ kind: 'course', id }} />`.
3. Home: add a "Pick up where you left off" rail (enrollments + last AI tutor thread + unread resources) above existing rails.
4. Profile: replace static "Suggested for you" with the same hook scoped to that user's goals.
5. AI Tutor: after each assistant turn, surface a `<NextStepCard />` (course / resource / practice).

Verification: snapshot a profile with no enrollments — recommendations fall back to featured items without throwing.

## Phase 5 — Profile & progress hooks

The Profile page becomes the activity hub that links back to every source page.

1. New tabs (already partially scaffolded in `src/components/profile/tabs/`):
   - **Learning** → enrollments, mastery (links to `/courses/:slug`, `/lesson/:id`).
   - **Library** → saved resources & wishlist (links to `/resources/:slug`, `/product/:slug`).
   - **Activity** → orders, mentor sessions, community posts (links to `/orders/:id`, `/mentors`, post deep-links).
   - **Achievements** → XP / streak / game badges (links to `/game`, `/leaderboard`).
2. Each card uses `hf-card-depth` and gets a "View all" CTA that routes to the corresponding page.
3. Persistent **"Continue learning" widget** in the layout sidebar (`MobileLayout` already exists) showing the next topic from `get_next_recommended_topic` RPC, linking to `/learn` and `/ai-tutor`.

Verification: 181 existing tests stay green; add one test asserting Profile's Learning tab renders enrollment rows with correct `/courses/:slug` hrefs.

## Phase 6 — Polish & verification

1. Add `<Breadcrumbs />` to all detail pages listed in Phase 1.
2. Run visual regression (`tests/visual/*`) — expect new breadcrumbs and "Related" rails only.
3. Update `scripts/generate-sitemap.ts` so every newly cross-linked path appears in `public/sitemap.xml`.
4. Update `mem://features/...` with the connection map for future agents.

## Technical notes

- **No backend schema changes.** All data already exists; we add a `nav-map.ts` registry, one hook (`useRecommendations`), and two shared components (`Breadcrumbs`, `RelatedRail`) plus chips.
- **Performance.** Wrap `<RelatedRail />` in the existing `LazyMount` and reuse `embla-carousel-react` already in deps. Skeletons follow the patterns established in the recent Profile work.
- **Design tokens.** All new components use `hf-title`, `hf-eyebrow`, `hf-section`, `hf-card-depth`, `hf-card-hover` so the look stays consistent with the Higgsfield polish already shipped.
- **Accessibility.** Breadcrumbs and rails get proper `aria-label`s; chips are real `<a>` elements with focus rings.
- **SEO.** Breadcrumbs emit JSON-LD; sitemap regenerated.

## Out of scope

Admin pages, auth flows, payment, light theme, new backend tables, new AI prompts.

## Open question

Do you want Phase 1+2 shipped together first (so every page instantly gets breadcrumbs and global search), and Phases 3–5 staged page-by-page, or do you prefer one full ship across all pages?
