# Home page redesign — Editorial Magazine

**Direction:** Calm & editorial · Magazine layout · Mission/brand hero
**Locked tokens (from memory):** Indigo `#3b4fe0`, warm cream `#faf6ef`, pure black dark, Plus Jakarta Sans, Departure Mono labels, Sentient quotes, 20px bento radius.

## What changes

Today `src/pages/Index.tsx` stacks ~15 sections (WarmBentoHero, FlexiTopSection, TodayMissionCard, ContinueLearning, RecommendedForYou, QuickAccessGrid, AiAssistantBox, MobileCoursesTop, GalleryCarousel, MasterpieceShowcase, ComingSoonTrio, admin sections, Testimonials, ProgressSnapshot, ActivityFeed). It reads as a dense product surface, not as ASIKON's story.

The redesign reshapes the page into a five-spread editorial **without removing functionality** — every existing section finds a home, just inside a magazine rhythm with generous whitespace and a clear front-to-back read.

## New structure (top to bottom)

```text
┌──────────────────────────────────────────────┐
│  SPREAD 1 — COVER                            │
│  Eyebrow: ISSUE 06 · JUNE 2026               │
│  Oversize display: ASIKON mission line       │
│  Pull-quote (Sentient) + Enter buttons       │
│  Quiet partner marquee at the bottom         │
├──────────────────────────────────────────────┤
│  SPREAD 2 — ISSUE INDEX (mission/brand lead) │
│  Two-column: left = <MissionVision/> excerpt │
│  Right = numbered TOC linking to the         │
│  sections below (Today, Continue, Courses,   │
│  Community, Mentors, Trust)                  │
├──────────────────────────────────────────────┤
│  SPREAD 3 — FEATURE STORY                    │
│  Editorial featured course/product card:     │
│  big image left, headline + dek + price +    │
│  CTA right. Below: 3 supporting cards        │
│  (Continue · Today's mission · AI Tutor)     │
├──────────────────────────────────────────────┤
│  SPREAD 4 — DEPARTMENTS (curated grid)       │
│  Magazine grid of departments:               │
│  • Library (courses + books carousels)       │
│  • Workshop (prompts, AI tutor, planner)     │
│  • Community (posts carousel)                │
│  • Mentorship (waitlist promo)               │
│  Each opens with a Departure Mono dept       │
│  label + thin rule, then the existing        │
│  carousels/components inside.                │
├──────────────────────────────────────────────┤
│  SPREAD 5 — BACK MATTER                      │
│  Testimonials columns · Progress snapshot ·  │
│  Activity feed · How it works · Why trust    │
│  Closing colophon line                       │
└──────────────────────────────────────────────┘
```

## Section mapping (nothing deleted)

| Existing component | New home |
|---|---|
| `WarmBentoHero`, `FlexiTopSection`, `ImageHeroSlider`, `DesktopHeroBento`, `DesktopWebstoreHome` | Replaced by new **Cover** spread (kept as components, no longer rendered on `/`) |
| `<MissionVision/>` excerpt | **Issue Index** left column |
| `FeaturedProducts[0]` | **Feature Story** lead |
| `TodayMissionCard`, `ContinueLearningRow`, AI tutor tile | **Feature Story** support row |
| `MobileCoursesTop`, `GalleryCarousel`, `ProductCarousel` (trending / new arrivals / curated) | **Departments → Library** |
| `QuickAccessGrid`, `AiAssistantBox`, `RecommendedForYou` | **Departments → Workshop** |
| `CommunityCarousel`, `MasterpieceShowcase` | **Departments → Community** |
| `MentorshipHomeSection`, `ComingSoonTrio` | **Departments → Mentorship** |
| `TestimonialsColumns`, `ProgressSnapshot`, `ActivityFeed`, `HowItWorks`, `WhyTrust` | **Back Matter** |
| `BrandStrip`, `PartnerMarquee` | Quiet footers between Cover and Index, and at end of Back Matter |
| `AiTutorFab`, `FirstRunTour`, `SEO` JSON-LD | Unchanged |
| Admin-ordered `useHomeSections` rest | Rendered inside Departments at the position admins already control |

## Editorial design rules

- **Type scale:** display headline `clamp(3rem, 9vw, 7rem)` Plus Jakarta Sans 800, dek `1.125rem` 400, body `0.9375rem` 400. One Sentient pull-quote per spread max.
- **Labels:** Departure Mono uppercase, `0.625rem`, `letter-spacing: 0.22em`, used for eyebrows, dept names, page numbers.
- **Rules:** 1px hairlines in `hsl(var(--foreground)/0.12)` between spreads. No drop shadows on hero. Bento tiles keep 20px radius inside Departments only.
- **Whitespace:** vertical rhythm `space-y-20 lg:space-y-32` between spreads, `space-y-8` inside.
- **Motion:** existing `Reveal` (fade-up 12px, 400ms ease-out). No marquees in the cover. Pull-quote fades in on scroll. No new motion libs.
- **Signed page number** bottom-right of each spread (Departure Mono), e.g. `01 / 05`.

## File changes

**Create**
- `src/components/home/editorial/EditorialCover.tsx` — Spread 1
- `src/components/home/editorial/IssueIndex.tsx` — Spread 2 (renders `<MissionVision variant="excerpt"/>` + TOC)
- `src/components/home/editorial/FeatureStory.tsx` — Spread 3 (uses `useFeaturedProducts(1)` + `TodayMissionCard` + `ContinueLearningRow`)
- `src/components/home/editorial/Department.tsx` — section wrapper (label + rule + children + page number)
- `src/components/home/editorial/BackMatter.tsx` — Spread 5

**Edit**
- `src/pages/Index.tsx` — replace the rendered tree with the five spreads; keep `SEO`, `FirstRunTour`, `AiTutorFab`, `useHomeSections`, `useProducts`, `useFeaturedProducts` data wiring; pass admin-ordered `restSections` into `<Department name="Library">` as children alongside the carousels.
- `src/index.css` — add `.editorial-rule`, `.editorial-eyebrow`, `.editorial-pagenum` utility classes (tokens only, no hex).

**Keep but unused on `/`**
- `WarmBentoHero`, `FlexiTopSection`, `DesktopHeroBento`, `DesktopWebstoreHome`, `ImageHeroSlider` remain in the repo for other surfaces — no deletions.

## Technical notes

- All copy that touches mission/vision pulls through `<MissionVision/>` per Core memory — no hardcoded mission strings.
- Carousels stay on `embla-carousel-react` per memory.
- Infinite-loop scroll behavior preserved (Departments still mount the existing carousels untouched).
- Logged-out vs logged-in branches collapse into one tree; auth-gated sub-blocks (Today mission, Continue learning, Progress, Activity) render conditionally inside their spreads.
- Lazy-loaded sections stay `lazy()` + `<Suspense>` to protect first paint.
- No backend, schema, or RLS changes.

## Out of scope

- Brand tokens (locked).
- Removing/replacing the FAB content-creation flow.
- Admin home-sections schema — admins keep ordering control inside the Library department.
- Other routes (`/shop`, `/community`, etc.) are untouched.

## Verification

- Capture `/` at 560px and 1280px after build; confirm five distinct spreads, hairline rules visible, page numbers present.
- Confirm `<MissionVision/>` renders in Issue Index and no mission strings are hardcoded (`rg -n "ASIKON" src/components/home/editorial`).
- Confirm logged-in extras (Today mission, Continue, Progress, Activity) only render when `user` is set.
