---
name: Parent Trust Layer
description: Mentor verification (admin-managed), parent_links (parent ↔ student), and mentor_session_notes feed a Verified-tutor badge on MentorCard, a SessionNotesPanel for parents, and verify/revoke controls in /asikonasik/mentors. Auto-installs missing user_roles + has_role infra.
type: feature
---
# Milestone 3 slice 1: Parent Trust Layer

## Schema (live)
- `user_roles` + `app_role` enum + `has_role(uuid, app_role)` — created here because the December 2025 migration file was never applied to the live DB. CEO email `emysan.ceo@gmail.com` is backfilled as admin.
- `mentor_verifications(mentor_id UNIQUE, status, id_check, qualification_check, background_check, verified_at, verified_by, notes)` — admin-only writes, public SELECT.
- `parent_links(parent_user_id, student_user_id, relationship, status pending|verified|revoked)` — RLS scoped to either party.
- `mentor_session_notes(mentor_user_id, mentor_id, student_user_id, student_name, session_date, topics_covered[], strengths, growth_areas, homework)` — RLS: mentor reads own + verified parent reads + admin reads.

## RPCs
- `is_verified_parent_of(_student_user_id)` SECURITY DEFINER — used inside the session-notes SELECT policy.

## Frontend
- `useTrust.ts` exports `useMentorVerificationsMap`, `useUpsertMentorVerification`, `useParentLinks`, `useSessionNotes`, `useCreateSessionNote`.
- `<VerifiedTutorBadge verification />` — shield-check pill with tooltip listing the actual checks completed. Used on Mentors page cards.
- `<SessionNotesPanel />` — list of session notes for the signed-in user. Empty state explains the feature for first-time parents. Not yet routed; drop into Profile when parent-mode tab ships.
- `/asikonasik/mentors` admin page now has Verify / Revoke buttons per mentor that upsert into `mentor_verifications` and flip all three check flags.

## Out of scope (next slices)
- Parent ↔ student invite/accept UI.
- Mentor-side "Add session note" composer (insert hook is ready: `useCreateSessionNote`).
- Weekly parent digest email (needs email infra setup).
- Nagad checkout (needs merchant credentials).
