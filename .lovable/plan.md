## Goal

Turn the logged-in Home into a **learner workspace** (Notion + Duolingo + Linear feel). The marketing-heavy sections (testimonials, FAQ, why-trust, how-it-works, final CTA, big trending carousels) move to a **landing experience for logged-out users and normal users**. One psychological goal for logged-in Home: *"I know what to do next."*

## New logged-in Home structure (top → bottom)

```
[1] under the hero sliders , show Greeting strip      — name, streak, one-line motivational state, avatar
[2] Today's Mission     — dominant hero card, single CTA "Continue Mission"
[3] Quick Access Grid   — functions access of full app show as carasol 2 row 4 column for mobile, and responsive for dextop.
[4] Progress Snapshot   — XP ring, streak, weekly minutes, missions done
[5] Continue Learning   — Netflix-style "resume" row (last lessons)
[6] AI Assistant box    — compact input → /learn with prefilled prompt
[7] Activity Feed       — own completions, badges, light community pings
[8] Upcoming / Schedule — next quiz, pending weekly goal, live session
[9] Insight card        — rotating tip (learning / AI / motivation)
```

Bottom nav stays as today (Home / Explore / AI / Community / Profile) — no change.

## Logged-out Home (separate path)

Keep the current marketing sections (hero carousel, quick_categories, trending, mentorship teaser, how_it_works, why_trust, curated, new_arrivals, testimonials, faq, final_cta) but render them **only when `!user**`. Logged-in users never see them on `/`.

## What gets keep logged-in Home

Hero carousel, quick_categories, trending, curated, new_arrivals, community PostCard, how_it_works, why_trust, testimonials, FAQ, final_cta, mentorship marketing block. (All still reachable from Explore / Mentors / Community pages.)

## File-level changes

**New components** under `src/components/home/workspace/`:

- `GreetingStrip.tsx` — name + streak chip + state line + avatar (uses `useAuth`, `useLearnerProfile`).
- `TodaysMissionHero.tsx` — wraps existing `TodayMissionCard` with a bigger visual treatment + single primary CTA.
- `QuickAccessGrid.tsx` — 6–8 tiles: Continue Learning, AI Tutor, Study Planner (→ /learn), My Progress (→ /profile), Community, Mentors, Notes (→ /prompts or saved), Saved (→ /wishlist).
- `ProgressSnapshot.tsx` — XP ring + streak + weekly minutes + missions completed. Reuses `XPBar`, `StreakBadge`; adds a `WeeklyMinutes` mini stat fed by `useLearnerProgress`.
- `ContinueLearningRow.tsx` — horizontal `MobileScroller` of resumeable lessons via `useLearnerProgress` / `lesson_completions` recency; falls back to active track lessons.
- `AiAssistantBox.tsx` — single input + 3 chip suggestions ("Summarize topic", "Generate routine", "Improve prompt"); submitting navigates to `/learn?q=...`.
- `ActivityFeed.tsx` — last 5–8 events: own completions (`lesson_completions`), milestones (`milestones`), optional follow activity. Lightweight, no images.
- `UpcomingCard.tsx` — derived view: next lesson in active track, weekly goal status, any scheduled mission.
- `InsightCard.tsx` — rotating static array of tips (client-side, daily seed).

**Modified**: `src/pages/Index.tsx`

- Split into `LoggedOutHome` (current `SECTION_RENDERERS` flow) and `LoggedInHome` (new vertical stack above).
- Switch on `useAuth().user`.
- Keep `AppLayout`, container, spacing tokens.

**Modified**: `src/hooks/useHomeSections.ts`

- Add new keys to FALLBACK so admins can still toggle workspace blocks: `ws_greeting`, `ws_mission`, `ws_quick_access`, `ws_progress`, `ws_continue`, `ws_ai_box`, `ws_activity`, `ws_upcoming`, `ws_insight`. Existing marketing keys stay (used by logged-out view).
- No DB migration required — fallback handles new keys; admins can insert rows later.

**Unchanged**: bottom nav, mobile header, mentorship page, all marketing components themselves.

## Data sources (all existing)

- `useAuth`, `useLearnerProfile` (xp, streak)
- `useTodayMission`, `useLearnerProgress`, `useTracks`
- `lesson_completions`, `milestones` (direct supabase queries inside new hooks)
- No new tables, no migration.

## Visual rules

- Workspace, not marketing: tight spacing, glass cards, no big banners.
- Mission card is the visual anchor — larger radius, gradient border, primary CTA.
- Quick Access tiles: square-ish, icon + label, min 64px tap target, 3 cols mobile / 4 cols ≥sm.
- All colors via existing semantic tokens (`gradient-primary`, `glass`, `border-border/60`). No hex.
- Reuse `MobileScroller`, `Reveal`, `SectionHeader`.

## Order of work

1. Add 9 new workspace components (stubs wired to existing hooks).
2. Refactor `Index.tsx` to branch on auth and render new stack.
3. Extend `useHomeSections` FALLBACK with `ws_*` keys (toggle support only, no UI change needed in admin yet).
4. QA at 393px mobile viewport (current preview), then ≥md and desktop.
5. Verify build clean.

## Out of scope (this pass)

- Admin UI for reordering workspace blocks (FALLBACK only).
- Real "study planner" / "notes" pages — Quick Access links route to closest existing screen.
- Push/notification scheduling for Upcoming card.