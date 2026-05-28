# Asikon UI/UX Polish Plan — "Study, Skill, Future"

Goal: make Asikon feel like a modern AI learning school (Duolingo habit + Khan calm + Coursera structure + Notion clarity). Preserve every route, feature, RPC, and data flow. This is a presentation-layer pass only.

## 1. Design System Refresh (foundation)

Touch only `src/index.css` and `tailwind.config.ts`. No component logic changes.

- **Palette (HSL tokens)**
  - `--primary`: deep indigo `231 55% 28%` / `--primary-foreground` near-white
  - `--accent`: soft warm action `28 90% 58%` (used sparingly for one CTA per section)
  - `--background`: `0 0% 99%` light / `230 25% 8%` dark
  - `--muted` / `--border`: cool neutrals (no rainbow)
  - Status: `--success 152 55% 42%`, `--warning 38 92% 52%`, `--destructive 0 72% 52%`, `--streak 22 90% 55%`
  - Retire the existing dark-red brand gradient from learning surfaces; keep it only on commerce/community headers where it already lives.
- **Typography**: keep Space Grotesk display + Inter body; add Bengali-friendly fallback stack (`'Hind Siliguri', 'Noto Sans Bengali'`) on `body` and headings. Base size 16px, line-height 1.6, headings `tracking-tight`.
- **Radius / elevation**: standardize `rounded-2xl` for cards, `rounded-xl` for inputs/buttons; introduce `--shadow-soft` (low-opacity, large blur) and `--shadow-focus` for the one primary card per screen.
- **Motion**: single easing token `--ease-calm: cubic-bezier(.2,.7,.2,1)`, durations 150/220/320ms. No bouncy springs on learning surfaces.

## 2. Screen-Level Polish (no behavior changes)

Each item lists the file(s) and the visual/copy changes only. State, queries, routes, and handlers stay intact.

### Welcome — `src/pages/Welcome.tsx`
- Replace marketing-heavy hero with: eyebrow "AI Learning School", H1 "Learn AI. Build Skills. Create Your Future.", one primary CTA "Start Learning Free", one ghost CTA "See how it works".
- Remove the COD/books testimonial (contradicts digital-only model).
- Three trust strips: "Instant Access", "Bangla + English", "Free to start".
- Quiet section dividers, no gradients.

### Auth — `src/pages/Auth.tsx`
- Centered single-column card, generous padding, FloatingField kept as-is.
- Fix all "AI tuor" → "AI tutor" in supporting copy.
- Add small reassurance line under CTA: "We never share your info."

### Onboarding
- Reduce to 3 steps max: Class level → Goal (exam / skill / curiosity) → Daily minutes.
- Big touch targets (min 56px), one question per screen, progress dots top.

### Dashboard — `src/pages/Index.tsx` + `src/components/home/*`
- New hierarchy (top → bottom):
  1. Soft header: greeting + streak chip + XP chip (chips, not big counters).
  2. **Today's Mission** — single elevated card, one CTA "Start 10-min lesson". Uses `TodayMissionCard` (already strong).
  3. **Continue Learning** — last lesson card, compact.
  4. **AI Tutor entry** — calm card "Ask anything. Get exam-ready answers." → `/learn`.
  5. **Your Path** — 3 next lessons, horizontal scroll, small thumbnails.
  6. **Revision due** — 1 line + button.
  7. Remove bento clutter, mock community feed, and `cartCount = 2` hardcode (use `useCart()`).
- Kill the dashboard-as-admin-panel feel: no stat tiles, no leaderboards above the fold.

### Lessons — `src/pages/LessonDetail.tsx`
- Add `react-markdown` + `remark-gfm` rendering (already listed as needed). Typography plugin classes `prose prose-lg`.
- Reading column max-width `65ch`, line-height 1.7, larger H2/H3.
- Sticky bottom action bar on mobile: "Mark complete" + "Next lesson".
- Quiet progress bar at top, no celebratory confetti until completion.

### AI Tutor / Learn — `src/features/learn/LearnChat.tsx`
- Calm empty state: short Bangla + English greeting, 4 example chips (exam prep, explain concept, summarize, practice MCQ).
- Message bubbles: user = primary tint, assistant = bare on background (per chat-agent contract).
- Replace "Sparkles" identity icon with a small Asikon mark.
- Keep streaming, MCQ→XP, Edge Function wiring exactly as-is.

### Revision — `src/pages/Revision.tsx`
- Single column, "Due today" count as a small chip, one card stack reviewer.
- Friendly empty state: "Nothing due. Come back tomorrow."

### Shop — `src/pages/Shop.tsx`
- Trim to: search, category pills, product grid (2 cols mobile / 3 desktop).
- Digital-only trust strip under header: Instant Access · Secure Checkout · Money-Back.
- Remove regex-based `detectProductType`-driven badges from the UI surface (keep function until a real column ships).
- Product card: image, title, price, one-line benefit, single CTA.

### Community — `src/pages/Community.tsx`
- Keep tabs (already aligned). Calm empty states per tab ("Be the first to share what you learned today").
- FAB stays bottom-left (per prior change), `aria-label` kept.
- Remove mock data imports from the tab views; render real empty states until backend is wired (no schema work in this pass).

### Mentors — `src/pages/Mentors.tsx` + `MentorCard`
- Premium card: portrait, name, subject, 1-line credibility, "Join waitlist" CTA.
- Replace hardcoded ratings/enrolled counts on `TrackDetail` with neutral copy ("New cohort") until aggregates exist.

### Profile — `src/pages/Profile.tsx`
- Header: avatar, name, class, streak + XP chips.
- Sections: Learning progress · Achievements · Settings entry. Remove income/earning framing anywhere it leaked in.

## 3. Shell & Navigation

- **Mobile BottomNav** (`src/components/layout/BottomNav.tsx`): 5 items max — Home · Learn · Revision · Community · Profile. Move Shop into Profile or a top-right icon. Keep tap-active-to-scroll-top.
- **Desktop Sidebar** (`AppLayout`): calm, persistent, collapsible to icon rail. Active route uses subtle left accent bar, not a filled pill.
- **Header**: greeting + streak only on Home; other pages get a quiet titled header.
- **Unauthed `/`** → redirect to `/welcome` (one-line guard in `Index.tsx` using existing auth hook).

## 4. Copy & Trust Pass (no logic)

- Global find/replace `AI tuor` → `AI tutor` across `src/**/*.{ts,tsx}` and `src/copy/copy.ts` + SEO/JSON-LD.
- Replace earning/freelancing phrases with learning phrases in `src/copy/copy.ts`.
- Fix dead link `/ai-tutor` → `/learn` in `FlexiTopSection.tsx`.
- Add Bangla short labels alongside English on BottomNav, Today's Mission, primary CTAs (no i18n framework yet — bilingual labels inline).

## 5. States

- Skeletons (already partly present): standardize one `<CardSkeleton />`, `<ListSkeleton />`, `<LessonSkeleton />` under `src/components/skeletons/`.
- Empty states: shared `<EmptyState icon title description action />`.
- Error states: shared `<ErrorState onRetry />` with calm copy, no red walls.

## 6. Out of Scope (explicit)

- No DB schema changes, no new Supabase tables, no migrations.
- No new routes, no removed routes.
- No backend wiring of the community feed (UI-only empty states this pass).
- No brand identity change (logo, name, core gradient on commerce surfaces preserved).
- No i18n library install.

## 7. Technical Notes

- All colors via HSL semantic tokens in `index.css` + `tailwind.config.ts`. Zero hex/`text-white`/`bg-black` in components.
- Components stay atomic; split anything >200 lines touched during polish.
- Strict TS, no `any`.
- Verify each touched screen at 393px (current viewport) and ≥1280px.
- After edits: run typecheck/build (automatic), spot-check Home, Lesson, Learn, Shop, Community, Profile.

## 8. Suggested Execution Order

1. Tokens + typography (`index.css`, `tailwind.config.ts`)
2. Shell (AppLayout, BottomNav, Sidebar, unauth redirect)
3. Dashboard (Index + home components, fix cart badge)
4. Lesson rendering (markdown)
5. Learn chat polish
6. Welcome + Auth + Onboarding
7. Shop, Community, Mentors, Profile
8. Global copy pass ("AI tuor", dead links, COD testimonial, hardcoded stats)
9. Shared skeletons / empty / error
10. Visual QA pass at mobile + desktop

Approve to switch to build mode and I'll execute in this order.
