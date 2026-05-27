
# ASIKON Improvement Plan

Four phases, shipped in order. Each phase is independently testable.

---

## Phase 1 — 🔴 Security hardening

**Goal:** Clear both Supabase linter warnings + tighten privileged functions.

1. **Enable HIBP leaked-password check** — flip on in Supabase Auth settings (manual dashboard toggle; I'll link directly to it; not a migration).
2. **Audit `SECURITY DEFINER` functions** for the one flagged as executable by all authenticated users. Plan: revoke `EXECUTE … FROM PUBLIC` on every public SECURITY DEFINER function and `GRANT EXECUTE` only to the roles that need it (`authenticated` for user-callable ones like `redeem_reward`, `get_or_create_today_mission`; nothing for internal trigger-only functions like `protect_*`, `enforce_*`, `handle_*`, `log_*`, `recalculate_*`, `touch_last_seen`).
3. **Mark the security finding fixed** after migration runs.

---

## Phase 2 — 🔴 Full-text search with ranking

**Goal:** Replace `ilike` with weighted Postgres FTS so results feel relevant.

1. **Migration:** add generated `search_vec tsvector` columns + GIN indexes on:
   - `products` — weight A: name, weight B: description
   - `content_items` — weight A: title, weight B: summary, weight C: tags
   - `mentors` — weight A: name, weight B: subjects, weight C: bio
   - `posts` — weight B: content
2. **RPC `global_search(q text)`** returning unioned, normalized, ranked rows (`source, id, title, slug, image, score`). One round-trip instead of four. SECURITY INVOKER so RLS still applies.
3. **Refactor `useGlobalSearch.ts`** to call the RPC; keep the same return shape so `SmartSearch` / `MobileSearchOverlay` need no changes.
4. **Fallback:** if `q` < 3 chars, keep current trending/recent path.

---

## Phase 3 — 🔴 Analytics & event tracking

**Goal:** Light, first-party event log we can query for product decisions.

1. **Migration:** ensure `user_activity_log` table exists (it does — extend if needed) and add events: `search_performed`, `product_viewed`, `cart_add`, `lesson_completed` (already logged), `mentor_waitlist_joined`, `ai_tutor_message`, `content_purchased`. RLS: insert by self, select by admins.
2. **Client helper** `src/lib/analytics.ts` — `track(event, meta)` that calls a single edge function `log-event` (so we can swap providers later). Fire-and-forget, no UI blocking.
3. **Wire call sites:** `SmartSearch` (on submit), `ProductCard`/`ProductDetail` (on view + add-to-cart), `MentorWaitlistSheet` (on submit), `LearnChat` (on AI send).
4. **Admin Analytics page** gains an "Events (last 30d)" panel with top searches + funnel counts.

---

## Phase 4 — 🟡 Medium impact + 🟢 polish

Shipped as a single phase so it stays cohesive.

1. **Image perf**
   - Add `vite-imagetools`; convert bundled hero/cover assets to AVIF+WebP with `srcset`.
   - For Supabase-hosted images, append render-on-demand `?width=…&quality=75` params (Supabase image transformations) in `ProductCard`, `content covers`, `avatars`, with sized `srcset`.
   - Preload LCP image on Home in `index.html`.
2. **Per-route SEO** — install `react-helmet-async`, wrap app, and add `<Helmet>` blocks with title/description/canonical/JSON-LD to:
   - `ProductDetail` → `Product` schema
   - `ContentDetail` (course/digital/service) → `Course` / `Product` schema
   - `Mentors` list + individual → `Person` schema
   - Remove duplicate canonical from `index.html`.
3. **AI tutor cost controls** — edit `ai-tutor-chat` edge function to enforce per-user daily message cap (e.g. 50/day for `user`, unlimited for admins) via a count query on `ai_messages`. Returns 429 with friendly message when exceeded. (Per Lovable policy this is a soft per-user cap, not infrastructure rate limiting.)
4. **Empty states & onboarding** — first-run overlay on Home (4-step tour: Learn → Shop → Community → Mentors), stored in `localStorage` flag `asikon:onboarded`. Empty-state illustrations + CTA on `CoursesList`, `DigitalList`, `ServicesList`, `Community`.
5. **Mobile search UX** — in `MobileSearchOverlay`: `autoFocus`, `enterKeyHint="search"`, `inputMode="search"`, scroll-lock on `<body>` while open, swipe-down to close.
6. **PWA / offline lessons** — add `vite-plugin-pwa`, precache app shell, runtime-cache `content-covers` + `avatars`, and IndexedDB-cache the last 10 viewed lessons (`LessonDetail`) so they render offline.
7. **A11y pass** — audit glass surfaces in `index.css` for WCAG AA; bump body-text contrast where needed; add `aria-label` to icon-only buttons in header/sidebar/FAB. Run axe on Home, Shop, ContentDetail, Community.

---

## Technical notes

- **Edge functions touched:** new `log-event`, edit `ai-tutor-chat`.
- **New deps:** `react-helmet-async`, `vite-imagetools`, `vite-plugin-pwa`, `idb-keyval` (for offline lesson cache).
- **No breaking schema changes** — all new columns are generated/optional; existing queries keep working.
- **Out of scope:** payment gateway, real-time presence, mobile native wrapper.

Approve and I'll start with Phase 1 (migration + dashboard link).
