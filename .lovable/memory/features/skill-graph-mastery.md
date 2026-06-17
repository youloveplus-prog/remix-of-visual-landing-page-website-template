---
name: Skill graph & mastery
description: Per-topic mastery scoring (learner_mastery) and prerequisite graph (topic_prerequisites) drive Next-Topic recommendations and SkillMap topic rows. Tutor turns call record_mastery_attempt RPC server-side from ai-tutor-chat onFinish using topic_hint + socratic_step + hint_level.
type: feature
---
# Milestone 2: Skill graph + mastery-driven recommendations

## Schema
- `curriculum_topics` (M1): canonical topic taxonomy keyed by `slug`.
- `topic_prerequisites(topic_id, prerequisite_topic_id)`: DAG of prerequisites. Public SELECT.
- `learner_mastery(user_id, topic_id, mastery_score 0-100, attempts, correct_count, hint_count, last_practiced_at)`: per-learner. RLS scoped to `auth.uid()`.

## RPCs (SECURITY DEFINER, authenticated only)
- `record_mastery_attempt(_topic_id, _outcome 0-1, _hint_level)` — EMA update with alpha=0.3. Bumps attempts/correct/hint counters. Called by the `ai-tutor-chat` edge function in `onFinish`.
- `get_next_recommended_topic()` — returns weakest unlocked topic (all prereqs ≥70 mastery, score <85) for the signed-in user. Drives `useNextTopic`.

## Tutor → mastery wiring
`ai-tutor-chat/index.ts` `onFinish` parses the `[ASIKON step= hint= topic=]` header, looks up the topic by slug, and calls `record_mastery_attempt` with outcome heuristic:
- `check` step: `0.95 - hint*0.12`
- `try` step: `0.6 - hint*0.08`
- `plan`: 0.4
- `understand`: 0.25

## Frontend
- `useMastery.ts` exports `useNextTopic` + `useTopicMastery`.
- `NextTopicCard` sits under TodayMissionCard on `/learn`, deep-links to `/ai-tutor?topic={slug}`.
- `SkillMap` now appends a "Recent topics" section under the track radar using topic mastery rows.

## Seeding
No `curriculum_topics` rows are auto-seeded. Until an admin (or migration) populates topics + prerequisites, `NextTopicCard` and the topic mastery list render nothing. Track-based SkillMap radar continues to work.
