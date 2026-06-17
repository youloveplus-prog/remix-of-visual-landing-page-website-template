# Sequential Improvement Plan

We'll ship improvements **one at a time**, smallest blast-radius first. After each step you review the preview, then say "next" to continue.

---

## Phase 1 — Security & Data Integrity (P0)

**Step 1. Lock down `community_posts` RLS** *(scan flagged it; current schema already shows correct policies, so this may just need verification + a SECURITY DEFINER RPC for counter bumps).*
- Audit current policies (already scoped to `auth.uid() = user_id` per latest schema — good).
- Add `increment_post_engagement(post_id, field)` SECURITY DEFINER function so likes/comments/shares can be bumped without granting broad UPDATE.
- Replace any client-side counter UPDATE with `rpc(...)`.

**Step 2. Remove mock data from production feeds**
- `FeedStoriesRail.tsx` + `FeedShortsRow.tsx`: fetch from Supabase (new `stories` / `shorts` tables or reuse `community_posts` filtered by type).
- Add empty + loading states.

**Step 3. Surface DB failures in `useProducts`**
- Remove silent `mockProducts` fallback.
- Return `{ data, error, isLoading }`; render error UI in `Shop`.
- Keep mock import dev-only (`import.meta.env.DEV`).

---

## Phase 2 — Quick SEO Wins (P1, low risk)

**Step 4. Add `<RouteSEO>` to 14 pages**
Cart, Checkout, CoursesList, CreateContent, LessonDetail, OrderDetail, Orders, Privacy, Refund, ResetPassword, ServicesList, Settings, Terms, TrackDetail, Wishlist.

**Step 5. Fix duplicate/missing `<h1>`**
- `ProductDetail`: collapse to one H1.
- Add visible/sr-only H1 to `Learn`, `Welcome`, `Settings`, authenticated `Game`.
- Remove duplicate `<SEO>` mount in `AiTutor.tsx`.

**Step 6. Replace ephemeral OG image in `index.html`**
- Generate a hosted OG image, swap `og:image` + `twitter:image`.

---

## Phase 3 — Accessibility (P2, low risk)

**Step 7. Restore focus-visible globally**
- Replace blanket `outline: none` with `:focus-visible` ring in `index.css`.

**Step 8. Fix alt text & ARIA labels**
- Meaningful `alt` in `AdminProducts`, `Library`, `Orders`, `OrderDetail`.
- `aria-label` on `BottomNav` icon buttons.
- `aria-expanded` / `aria-haspopup` on `MegaMenu` triggers.

**Step 9. Add `loading="lazy"` to 34 below-the-fold images.**

---

## Phase 4 — Refactor God-Files (P1, higher risk)

Each is a dedicated turn with build verification.

**Step 10. Split `Auth.tsx`** (830 → ~150 + 5 subcomponents): `LoginForm`, `RegisterForm`, `OtpStep`, `ResetPasswordForm`, `OAuthButtons`.

**Step 11. Split `prompt-input.tsx`** (1,463 lines) into logical parts + `React.memo`.

**Step 12. Split admin god-files**: `UserDetailDrawer`, `AdminUsers`, `AdminLegalAnalytics` — extract data hooks + sub-components.

---

## Phase 5 — Performance Polish (P2)

**Step 13.** Memoize `Shop` filtering/sorting (`useMemo`).
**Step 14.** `React.memo` on `PostCard`, `ProfileHeader`, `BentoGallery`.
**Step 15.** Fix lazy-import indirection in `App.tsx` (use `React.lazy(() => import(...))` directly).
**Step 16.** Skeletons for `AdminOverview` KPI cards (fix CLS).
**Step 17.** Tree-shake `mock-data.ts` from prod bundle.
**Step 18.** Split `useGameData` into per-slice React Query hooks with individual stale times.

---

## Verification gates

After each step:
- TypeScript build passes.
- Affected route renders in preview (Playwright screenshot for visual changes).
- For RLS/data changes: confirm read/write works for owner + fails for non-owner.

---

## Recommended start

**Step 1 (RLS audit + engagement RPC).** Reply **"start"** to begin, or name a different step (e.g. "start with step 4") to reorder.