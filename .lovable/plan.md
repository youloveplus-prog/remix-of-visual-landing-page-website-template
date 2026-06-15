
# ASIKON → Spec Alignment Plan

Audit confirms the 5 tabs, schema, and most components already exist. Below is the gap-closing work, ordered by user impact. Each phase is independently shippable.

---

## Phase 1 — Home becomes a real dashboard (highest impact)

Today, signed-in users still land on a marketing page; the spec says Home must feel like a "student workspace."

1. Split `src/pages/Index.tsx` cleanly:
   - **Guest** → keep existing marketing sections (hero, partners, how-it-works, testimonials).
   - **Authenticated** → render only the workspace: `GreetingStrip` (also on mobile), `TodayMissionCard`, `ContinueLearningRow`, `ProgressSnapshot`, `ActivityFeed`, `QuickAccessGrid`, plus a new `RecommendedForYou` row.
2. Wire the streak tile to real data from `learner_profiles.streak_days` / XP (remove the hardcoded "+30 XP today").
3. Add `RecommendedForYou`: simple v1 = "courses in your goal category you haven't purchased", later swap for ML.
4. Move the AI tutor entry from a full `/ai-tutor` page into a floating FAB on Home + Learn (keeps the 5-tab nav clean per spec).

## Phase 2 — Explore matches the marketplace spec

1. Fix filter chips in `ShopFilters` to spec set: **Courses / eBooks / Services / Bundles** (drop "kits"/"prompts" from UI; keep DB enum but map "digital" → eBooks).
2. Add `bundle` to `content_kind` enum + minimal bundle composition table (`bundle_items: bundle_id, content_item_id`).
3. Restructure `Shop.tsx` from a single grid into stacked sections: **Featured carousel** (top hero), **Best Sellers**, **New Arrivals**, **Bundles**, **All results** (filtered grid stays below).
4. Upgrade `ProductCard`:
   - Show **verified creator badge** when `profiles.is_verified`.
   - Show **enrollment count** for courses (new `content_items.enrollment_count` column, denormalized via trigger on `content_purchases`).
   - Distinct CTA: "Enroll" for courses, "Buy" for digital, "Book" for services.

## Phase 3 — Learn becomes a real course player

1. Introduce enrollments: new `enrollments(user_id, content_item_id, progress, enrolled_at)` table, auto-created on successful course purchase. "My Courses" in `Learn.tsx` reads from this (keep `tracks` as curated paths alongside).
2. Render `course_modules` + `course_lessons` in a curriculum accordion on the course detail screen (currently unused tables).
3. Expand `LessonDetail.tsx` video player with tabs: **Overview / Transcript / Notes / Resources** (transcript + resources come from new lesson fields; notes stored per user).
4. Add quiz UI: `quiz_questions` table (question, choices, correct_index), quiz-taking screen, write results to existing `quiz_attempts`.
5. Add certificate: `certificates(user_id, content_item_id, issued_at, code)` issued at 100% lesson completion, rendered on a printable page.

## Phase 4 — Item models, Profile, Community polish

1. Item model completeness:
   - Digital products: add `file_url`, `file_type`, `file_size`, `preview_url` to `content_items` (or formalize via `content_assets`).
   - Services: add `availability` (jsonb slots) and `location` to `service_details`.
2. Profile sub-tabs:
   - Add **Creator Portfolio** tab (visible when `is_creator`) listing their content_items + aggregate rating.
   - Rework **My Learning** tab to list enrolled courses with progress bars (uses Phase 3 enrollments).
   - Add a **Preview as public** toggle on `ProfileEditModal`.
3. Community:
   - Emit structured activity events ("completed course X", "earned badge Y") into `posts` with a `type` field; render them with distinct cards in **My Feed**.
   - Add **Comments** thread UI on `PostCard` (table already exists).
   - Surface `LeaderboardSheet` as a Community sub-tab (or pinned card), not a separate route.

## Phase 5 — Localization, onboarding goals, monetization extras

1. Auth/onboarding: add **Language selector** (EN/BN) and **Goal selection** step in `Auth.tsx` / `Welcome.tsx`, writing to `profiles.preferred_language` and `profiles.goal`.
2. Install `react-i18next`, scaffold `en.json` + `bn.json`, wrap top-nav strings + auth/onboarding first. Expand coverage incrementally — do **not** translate everything in one PR.
3. Monetization v1: keep existing commission model; add a placeholder `subscriptions` table + admin toggle so the Profile/Settings can later expose a "Premium" plan. No subscription UI in this phase.

---

## Technical notes

- **Schema migrations** in Phases 2–4 each ship as their own migration with required `GRANT`s + RLS policies (no public-schema table without grants).
- **Existing memories respected**: digital-only, no COD, indigo brand, glass UI, infinite-loop scroll, FAB content creation, `<MissionVision />` for about copy, mentorship as the Service surface for parents/children.
- **Out of scope** (not in spec or rejected by memory): COD checkout, POD, separate content-creation pages, "load more" buttons, red branding, on-site physical services.
- **Deferred**: real ML recommendations (Phase 1 ships a heuristic), full Bangla translation coverage (Phase 5 ships scaffold + key screens), Stripe Connect payouts (current bKash+card stack stays).

---

## Suggested ship order

```text
Phase 1 (Home)        — 1 PR, frontend-only
Phase 2 (Explore)     — 2 PRs: schema (bundle, enrollment_count) + UI
Phase 3 (Learn)       — 3 PRs: enrollments, curriculum+player tabs, quiz+cert
Phase 4 (Models+Prof) — 2 PRs: schema fill-in + profile/community UI
Phase 5 (i18n+goals)  — 2 PRs: onboarding step + i18n scaffold
```

Pick a phase to start with and I'll begin implementation.
