# Enhance Community Section → Real-time Carousel

Today the "From the community" carousel on Home renders static `mockPosts`. We'll turn it into a live feed: posts are fetched from the database, new posts stream in via Realtime, the carousel auto-plays, and a "LIVE" pulse + activity counters (likes/comments) update in place.

## What the user will see

- The Community carousel on `/` shows the **latest community posts** instead of the same 3 mock entries.
- A small **LIVE** chip with a pulsing dot sits next to the section title, plus "X people posting now" microcopy that increments as new posts arrive.
- New posts **slide in from the left** of the carousel without a page refresh (toast: "New post from @username").
- Like/comment counts on visible cards **animate** when they change (realtime UPDATE).
- Carousel **auto-advances** every 5s, pauses on hover/touch, resumes after interaction. Loops infinitely (consistent with our infinite-scroll rule).
- Empty state ("Be the first to share…") and skeleton loaders while fetching.
- Fully responsive — same breakpoints as today (100% / 85% / 60% / 50% slides).

## Scope

In: `CommunityCarousel`, Home Index wiring, new `community_posts` table + RLS, a `useCommunityFeed` hook, light visual polish on `PostCard` (count tick animation, "NEW" ribbon for <60s old posts).
Out: full posting UX (already exists on `/community` + `/create`), comments thread, moderation tools, mentorship/masterpiece sections.

## Technical changes

### 1. Database (migration)
- `public.community_posts` — `id uuid pk`, `user_id uuid` (→ profiles), `content text`, `images text[]`, `product_id uuid null`, `likes int default 0`, `comments int default 0`, `shares int default 0`, `created_at timestamptz default now()`.
- GRANTs: `SELECT` to `anon, authenticated`; full CRUD to `authenticated`; `ALL` to `service_role`.
- RLS: anyone can SELECT; INSERT/UPDATE/DELETE only `auth.uid() = user_id`.
- `ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;`
- Seed 6 rows from the current mock data so the section is never empty.

### 2. Hook — `src/hooks/useCommunityFeed.ts`
- Initial fetch: `select * order by created_at desc limit 12` joined with `profiles` for user info.
- Subscribes to `postgres_changes` on `community_posts` inside `useEffect`, tears down on unmount (per realtime guidance).
- Handles `INSERT` (prepend), `UPDATE` (merge counts), `DELETE` (filter).
- Maps DB rows → existing `Post` type so `PostCard` keeps working unchanged.
- Returns `{ posts, isLoading, liveCount }` where `liveCount` = posts created in last 5 min.

### 3. `src/components/community/CommunityCarousel.tsx`
- Accept optional `posts` prop; when omitted, call `useCommunityFeed()`.
- Add embla `Autoplay` plugin (5000ms, `stopOnInteraction:false`, `stopOnMouseEnter:true`) and `loop:true`.
- Header gets a `<LivePulse count={liveCount} />` next to the title.
- New-item enter animation via the existing `Reveal`/motion primitives.
- Skeleton state: 2 placeholder cards while `isLoading`.
- Empty state CTA → `/create`.

### 4. `src/pages/Index.tsx`
- Drop the `posts={mockPosts}` prop so the section self-loads.
- Keep `title` and `viewAllHref` as-is.

### 5. Minor `PostCard` polish
- Count numbers wrapped in a `<TickNumber />` (1-line component using framer-motion `animate` on value change).
- "NEW" pill (Departure Mono, butter chip) when `Date.now() - created_at < 60_000`.

## Diagram

```text
 community_posts (Postgres + Realtime)
        │ select + subscribe
        ▼
 useCommunityFeed() ──► posts[], liveCount, isLoading
        │
        ▼
 CommunityCarousel (embla + autoplay + loop)
   ├─ SectionHeader + LivePulse
   ├─ Skeleton / Empty / PostCards (TickNumber, NEW pill)
   └─ Prev/Next arrows (desktop)
```

## Risks / notes
- Realtime billing: single channel, scoped to one table, cleaned up on unmount — safe.
- Autoplay must respect `prefers-reduced-motion` — disable plugin when set.
- Keeps the centered display typography rule (SectionHeader unchanged).
