## Goal

Make every priority page behave correctly with real data: live Supabase queries, polished loading/empty/error states, working links, and proper auth gating. Roll out in 4 focused phases so each is reviewable.

## Phase 1 — Learning (Tracks, Lessons, Learn)

Now that `tracks`, `lessons`, `lesson_completions` exist:

- Seed 3 sample tracks + ~4 lessons each via `supabase--insert` so the UI has real content.
- `TracksSection`, `TrackDetail`, `LessonDetail`:
  - Replace fallback-only rendering with `isLoading` skeletons, empty state ("No tracks yet"), and error fallback.
  - Wire real completion progress from `useLessonCompletions`.
  - "Mark complete" button on `LessonDetail` → insert into `lesson_completions` (auth-gated, redirect to `/auth` when signed-out).
- Audit links: track cards → `/tracks/:slug`, lesson rows → `/lessons/:id`. Add 404 fallback when slug/id missing.

## Phase 2 — Shop & Product Detail

- Confirm `useProducts` / `useProductReviews` paths handle loading + empty + error uniformly (skeleton grid, "No products" card, retry button on error).
- `ProductDetail`: gate "Add to cart" / "Buy" → require auth; show toast + redirect to `/auth?next=...` when signed-out.
- Audit category chips, breadcrumb, related-rail links for dead routes.
- Wishlist toggle: auth-gated, optimistic update with rollback on error.

## Phase 3 — Mentors & Booking

- `Mentors` list: loading skeleton, empty state, error retry.
- `MentorDetail` + `MentorBookingPanel`: ensure booking insert respects RLS (`user_id = auth.uid()`), show success/error toasts, disable submit while pending, redirect signed-out users to `/auth`.
- "My bookings" surface on `Profile` (read-only list of the user's `mentor_bookings`).

## Phase 4 — Community & Profile

- `Community` feed: skeleton + empty + error states across tabs (My Feed, Posts, Reviews).
- Post composer + like/comment/share: auth-gated; use `increment_post_engagement` RPC; optimistic UI with rollback.
- `Profile`: load real profile via `useProfile`, show sign-in prompt for signed-out visitors instead of blank.
- Global link audit: run a small script to grep for `<Link to=` / `navigate(` and flag any targets without a matching route in `App.tsx`.

## Cross-cutting

- Standard helpers reused across phases:
  - `<PageSkeleton />`, `<EmptyState />`, `<ErrorState onRetry />` in `src/components/ui/` (create if missing).
  - `useRequireAuth()` hook → returns `(action) => signedIn ? action() : navigate('/auth?next=...')`.
- After each phase: run `bunx vitest run` and a Playwright smoke pass on the touched routes.

## Technical notes

- All new reads use `safeSelect`-style guards so missing tables never crash.
- Mutations use `useMutation` with `onError` toast + query invalidation.
- No design-token changes — keep the existing 60/30/10 palette and bento surfaces.

## Suggested order of execution

1. Phase 1 (Learning) — smallest blast radius, unblocks the 404 cleanup.
2. Phase 2 (Shop) — highest-traffic surface.
3. Phase 3 (Mentors) — completes the booking flow already in flight.
4. Phase 4 (Community/Profile) — most surface area, save for last.

Approve and I'll start with Phase 1.