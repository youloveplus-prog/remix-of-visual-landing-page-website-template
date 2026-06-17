
# Asikon — Outstanding, not just complete

A staged plan to turn the existing scaffolding (AI tutor, mentorship, community, shop) into one connected learning loop that 10MS structurally can't copy quickly. Sequenced so each milestone ships standalone value and the later ones compound on the earlier ones.

Out of scope here: any net-new product surface the user hasn't already validated (e.g. live classes, B2B school dashboards). We deepen what exists.

---

## Milestone 1 — Socratic AI tutor (the wedge)

Goal: the tutor stops feeling like "ChatGPT in a wrapper" and starts feeling like a teacher.

What changes for the user
- Tutor opens with a diagnostic prompt ("Show me what you've tried") instead of an empty box.
- Hints arrive **one at a time**. Each hint is gated behind a short student attempt (text, photo of work, or voice note).
- A visible "reasoning rail" on the side of the chat shows the tutor's current step: *Understand → Plan → Try → Check*. The student sees the method, not just answers.
- Every exchange is silently tagged to a curriculum topic (class / subject / chapter / skill) so it can feed Milestone 2.
- Voice input (mic button) for problems — Bangla or English — using Lovable AI speech-to-text.

Where it lives
- Rebuild around `src/pages/AiTutor.tsx` + `src/hooks/useAiTutor.ts` + `supabase/functions/ai-tutor-chat`.
- New edge function tool: `request_hint(level, topic_id)` that the model must call instead of free-form answering; server enforces hint-ladder + attempt gating.
- New tables: `tutor_sessions`, `tutor_turns` (with `topic_id`, `hint_level`, `attempt_payload`).

---

## Milestone 2 — Skill graph + mastery-driven recommendations

Goal: replace popularity-based "Recommended for you" with knowledge-based recommendations, and give students a visible map of what they know.

What changes for the user
- A `/learn` skill map upgrade: bento-style nodes per topic, glow intensity = mastery score, locked nodes show prerequisites.
- "Today's Mission" pulls the **weakest unlocked topic**, not a hardcoded one.
- Revision panel resurfaces tutor turns + lessons tied to topics where mastery decayed (spaced repetition).
- Course/lesson cards show "fills 3 gaps in your map" badge when relevant.

Where it lives
- Extend existing `src/components/learn/SkillMap.tsx` and `useSkillMap.ts`.
- New tables: `curriculum_topics` (NCTB class/subject/chapter taxonomy), `topic_prerequisites`, `learner_mastery (user_id, topic_id, score, last_practiced_at)`.
- New edge function: `update-mastery` (called from tutor turns + quiz submissions).
- Admin: add topic-tagger to `AdminLessons` / `AdminCourses` so content maps onto the taxonomy as it's authored.

---

## Milestone 3 — Parent trust layer for mentorship + Nagad

Goal: parents (the actual buyers for 1-on-1 tutoring) feel safe paying for a stranger to teach their kid; price-sensitive families have a payment rail that fits them.

What changes for the user
- Mentor profile gets verified-tutor badges (ID-verified, background-checked, subject-certified), session summaries visible to parent, weekly progress digest email.
- New `parent_view` toggle on profile: shows child's mastery deltas, mentor session notes, AI tutor highlights — read-only, no chat surface.
- Checkout adds **Nagad** alongside bKash + card. (Do not re-add COD — locked in memory.)
- Optional monthly subscription pricing tier for courses (alternative to one-time purchase) for budget-sensitive families.

Where it lives
- Extend `src/pages/Checkout.tsx`, `src/pages/admin/AdminMentors.tsx`, `MentorWaitlistSheet`.
- New tables: `mentor_verifications`, `mentor_session_notes`, `parent_links (parent_user_id, child_user_id, relationship)`.
- Payment: Nagad provider integration (server-side only).

---

## Milestone 4 — Low-bandwidth + Bangla-first polish

Goal: works as well in Rangpur on a budget Android with 3G as it does in Dhaka on fiber.

What changes for the user
- PWA offline cache for lessons the student has opened (text + already-watched video segments). Existing PWA stays manifest-only until this milestone — guarded service worker per skill rules.
- "Data saver" toggle: low-res images, video defaults to audio-only with transcript, autoplay disabled.
- Locale detection: outside-Dhaka devices default UI to Bangla (not just content), one-tap toggle in header.
- Apply the existing motion system (word-rise reveal, liquid-glass sheen) to completion + streak moments — consistent celebration vocabulary.
- Trust signals (rating, completion count, verified-buyer count) lifted onto course cards and mentor cards directly, not only on the homepage carousel.

Where it lives
- New: `src/hooks/useDataSaver.ts`, locale gate in `App.tsx`, guarded SW per PWA skill.
- Reuse: `Reveal.tsx`, `TrustIndicators.tsx`, `TrustStrip.tsx` — push to `ProductCard`, `CourseVideoCard`, mentor list items.

---

## Technical notes

```text
Curriculum + mastery (Milestone 2 schema, simplified)
┌──────────────────────┐    ┌───────────────────────┐
│ curriculum_topics    │◄──┤ topic_prerequisites    │
│  id, class, subject, │    │  topic_id, prereq_id  │
│  chapter, skill      │    └───────────────────────┘
└──────────┬───────────┘
           │
┌──────────▼───────────┐    ┌───────────────────────┐
│ learner_mastery      │    │ tutor_turns           │
│  user_id, topic_id,  │◄───┤  session_id, topic_id,│
│  score, decayed_at   │    │  hint_level, attempt  │
└──────────────────────┘    └───────────────────────┘
```

- Every new public table gets the standard GRANT block + RLS scoped to `auth.uid()`. Mentor verifications + parent_links are read via security-definer functions, never directly.
- Tutor hint-ladder runs server-side in the edge function with `stopWhen: stepCountIs(50)`; the client never sees "raw" answers, only the gated turn payload.
- Speech-to-text uses Lovable AI `openai/gpt-4o-mini-transcribe` via the gateway — no provider key requested from the user.
- Nagad integration goes through a server-side edge function; key requested via `add_secret` when we reach Milestone 3.
- Skill map respects existing warm-bento tokens; no new colors, no hardcoded hex.

## Sequencing rationale

Milestone 1 ships the differentiator the market literally pointed at (Khanmigo-style tutor for Bangladesh). Milestone 2 turns each tutor turn into compounding product data — the longer Asikon runs, the smarter recommendations get; competitors starting later can't catch up on this data. Milestone 3 unlocks the higher-LTV parent buyer for mentorship. Milestone 4 expands the addressable market beyond Dhaka.

## Suggested next step

Approve to start with **Milestone 1 only** — Socratic tutor + hint-ladder + voice input + topic tagging. That's the smallest slice that gives users something visibly new and lays the schema for everything after. Reply "start M1" to proceed, or tell me which milestone to lead with instead.
