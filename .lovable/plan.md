# Milestone 3 — Parent Trust Layer (slice 1)

The full M3 vision spans mentor verification, parent linking, session notes, weekly email digests, and Nagad payments. Those last two need decisions (email domain + Nagad merchant credentials) so I'm proposing to ship the **trust + transparency** half now and gate payments/email behind explicit approval.

## In scope this step

### Schema
1. `mentor_verifications` — one row per mentor profile; status (`pending|verified|rejected`), id_check, qualification_check, background_check booleans, verified_at, verified_by, notes. Admins read/write; everyone reads `status='verified'` summary via a view.
2. `mentor_session_notes` — written by mentor after a session: `mentor_id`, `parent_id`, `student_name`, `session_date`, `topics_covered[]`, `strengths`, `growth_areas`, `homework`. RLS: mentor writes own, linked parent reads.
3. `parent_links` — `parent_user_id`, `student_user_id`, `relationship`, `verified_at`. Self-serve link request + accept flow (deferred UI — schema only, accept stub).

### UI
- **Verified-tutor badge** on `MentorCard` (shield-check, "Verified mentor"). Tooltip explains the verification dimensions actually completed.
- **`MentorTrustStrip`** on mentor detail page: id verified · qualifications checked · background checked · response time · sessions completed.
- **`SessionNotesPanel`** in parent area of `/profile` — empty state with copy explaining what notes will look like; lists notes once a parent_link is established.
- **Admin tab** `Mentor verifications` under super-admin panel: queue of pending mentors, approve/reject with note. Uses existing audit-log hook.

### Hooks
- `useMentorVerification(mentorId)` and `useMentorTrustSummary(mentorId)`.
- `useSessionNotesForParent()` and `useCreateSessionNote()`.
- `useParentLinks()` (read-only this slice).

## Out of scope (next steps after this lands)

- **Nagad checkout** — needs merchant ID + secret; will request via `add_secret` once you confirm provider.
- **Weekly digest email** — needs `email_domain--check_email_domain_status` and template scaffolding.
- **Parent ↔ student invite flow UI** — schema lands now; invite + accept screens ship separately.

## Why this order

Trust badges and session-note plumbing are pure UI + schema, zero third-party dependencies, and immediately raise perceived legitimacy of the mentorship surface. Payments/email are higher-friction integrations that benefit from this trust layer already being visible.

---

Reply **"go"** to ship this slice, or tell me which pieces to swap (e.g. "skip session notes, start Nagad instead").