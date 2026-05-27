# ASIKON Learning OS — Phased Roadmap

Positioning: **AI-powered modern learning operating system for Bangladeshi students.**

## Current foundation (already built)
- Tracks, lessons, lesson completions, XP, streaks, daily missions, milestones
- AI chat (`LearnChat`) via Lovable AI Gateway
- Mentor waitlist, content marketplace, community feed, coins/rewards
- Admin panel with roles + audit logs

We extend this — not rebuild.

---

## Phase 1 — Better Learning (Student Core)

Goal: turn the catalog into a "next best step" engine.

1.1 **Personalized Mission Engine v2** — weak-skill detection from quiz scores + recency; home shows ONE primary CTA ("Your next step, 5 min") with everything else demoted; adaptive lesson ordering per learner.

1.2 **AI Study Assistant upgrade** (extend `LearnChat`) — tool calls: `explain_simply`, `summarize_lesson`, `generate_mcq`, `revision_mode`, `teach_like_im_15`; Bangla toggle; lesson-aware context when opened from a lesson.

1.3 **Smart Revision (spaced repetition)** — new `revision_items` + `quiz_attempts` tables; daily revision queue separated from new lessons; AI auto-generates practice from weak topics.

1.4 **Progress Visualization v2** — skill map (radial chart of subject mastery), weekly growth chart on Profile, streak-freeze item in rewards store.

1.5 **Microlearning format** — `lessons` adds `duration_min`, `format` (`card | video | quiz | challenge`); swipeable card runner for ≤5-min lessons on mobile.

1.6 **Project-Based Learning** — `projects` + `project_submissions` tables; "Build" tab per track; AI reviewer gives feedback + awards XP/coins on submission.

1.7 **Community Learning (safe)** — achievement feed (opt-in auto-posts), study groups keyed off tracks, replace global leaderboard with cohort/friends leaderboard.

## Phase 2 — Better Teaching (Creator Core)

Goal: make a teacher 10× more productive.

2.1 **AI Teaching Assistant** — generate quiz / summary / lesson plan / homework / explanation from topic or uploaded PDF; one-click "video → lesson + quiz + notes".

2.2 **Unified Content Builder** — single editor: video, PDF, notes, quiz, assignment; drag-and-drop ordering inside a track.

2.3 **Teacher Analytics Dashboard** — per-lesson completion %, drop-off point, avg quiz score; per-student streak risk, struggling topics, last seen; at-risk list with one-click AI-personalized nudge.

2.4 **Live Interaction** — live class slots (calendar + RSVP, reuses mentor booking); async Q&A board per lesson with AI-drafted answers teacher approves.

2.5 **Motivation Tracking & Intervention** — background job flags inactive learners; teacher dashboard surfaces them with one-click nudge.

## Phase 3 — Sustainable Business

Goal: retention-driven revenue.

3.1 **Freemium tiers** — Free (basic AI, 1 active track, community, missions). Pro monthly (unlimited AI, all tracks, revision engine, certificates, priority mentor matching). Add `subscriptions` + entitlement helper.

3.2 **Skill Tracks as products** — outcome-based: "AI for Students", "Prompt Engineering", "Freelancing Foundations", "Portfolio Building". Sold individually or in Pro.

3.3 **Certificates** — auto-generated on track completion (PDF + shareable public URL).

3.4 **School Partnerships** — `organizations`, `org_members`, `org_invites`; school admin sees cohort dashboards; bulk seat licensing.

3.5 **Marketplace (later, gated)** — approved creators sell templates / prompts / notes via existing `content_items` flow with admin approval.

---

## Technical notes

```text
Phase 1 DB additions
  revision_items(user_id, lesson_id|topic, ease, interval_days, next_due_at, last_grade)
  quiz_attempts(user_id, lesson_id, score, breakdown jsonb, created_at)
  projects(id, track_id, brief, rubric jsonb)
  project_submissions(id, user_id, project_id, deliverable_url, ai_feedback, score, status)
  study_groups(id, track_id, name, owner_id) + study_group_members

Phase 2 DB additions
  lesson_qna(lesson_id, user_id, question, ai_draft, teacher_answer, status)
  live_sessions(id, host_id, track_id, starts_at, join_url)
  live_rsvps(session_id, user_id)

Phase 3 DB additions
  subscription_plans, subscriptions(user_id, plan_id, status, current_period_end)
  organizations, org_members, org_invites
  certificates(id, user_id, track_id, issued_at, public_slug)
```

- AI: all model calls via Lovable AI Gateway (`google/gemini-3-flash-preview` default), tools via `tool()` + zod, `stopWhen: stepCountIs(50)`.
- Background jobs (revision due, at-risk learners, certificate issuance): `pg_cron` + edge functions.
- UI: keep liquid-glass dark-red brand; reuse `<MissionVision />` on narrative pages; mobile-first; respect `--bottom-nav-h`.

---

## Suggested build order

1. Revision engine + quiz attempts + skill map  *(highest learning impact)*
2. AI Study Assistant tools + lesson-aware context + Bangla toggle
3. Mission engine v2 (weak-skill detection + adaptive ordering)
4. Microlearning card runner + project submissions with AI feedback
5. Teacher AI tools + content builder unification
6. Teacher analytics + at-risk nudges
7. Subscriptions + entitlements + certificates
8. Organizations / school partnerships
9. Live sessions + Q&A
10. Marketplace polish

Reply "start 1" (or any number / phase) to begin building.
