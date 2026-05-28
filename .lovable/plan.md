# Asikon UI Fix Pack (9 changes)

Scoped, surgical edits. No routing/auth/RLS/design-token changes.

## Fix 1 — Community tabs use real Supabase data
Replace all mocks in `MyFeedTab`, `PostsTab`, `VideosTab`, `ShortsTab`, `ReviewsTab` with typed `useQuery` calls against `posts` + `profiles` join.

Notes:
- DB check: `posts` table has `content, images, video_url, rating, type, user_id, created_at, is_pinned`. It does NOT have `like_count`, `comment_count`, `view_count`, `thumbnail_url`, or `post_type`. The spec column names will be adapted:
  - `post_type` → existing `type` column
  - `like_count` / `comment_count` → derive via aggregate selects (`post_likes(count)`, `post_comments(count)`) using PostgREST relationship syntax, defaulting to 0
  - `view_count` / `thumbnail_url` → not in schema; omit (videos query selects only what exists; Videos/Shorts tabs fall back to empty state when no rows)
- Each tab gets: loading skeleton (3–4 card-shaped placeholders matching its card type), empty state with friendly copy + CTA `Button` → `/community/create` (or "coming soon" message for videos/shorts), and error state with retry calling `refetch()`.
- Preserve existing infinite-scroll loop behavior by feeding query results into `useInfiniteScroll`. If query empty, render empty state instead.
- `MyFeedTab` query: same posts select, no type filter, order desc, limit 30. Drop `buildMixedFeed`.
- Keep existing `PostCard`, `VideoCard`, `ShortCard`, `ReviewCard`, `FeedItemRenderer` props shape — map DB rows to those shapes in a small adapter inside each tab.

## Fix 2 — MobileHeader minimal redesign
`src/components/layout/MobileHeader.tsx`:
- Logo: bare `<img>` (no white circle pill).
- Title: remove `tracking-[0.22em]`, change to `font-display font-semibold text-[17px] tracking-tight`, drop all-caps.
- `TAB_TITLES.home`: `"Asikon"`.
- Remove Bell button + remove `Bell` import.
- New `iconBtnCls`: `"relative w-11 h-11 rounded-full bg-transparent border-0 flex items-center justify-center text-foreground/70 hover:text-foreground active:opacity-50 transition-opacity duration-100"`.
- Header height 56 → 52.
- `src/index.css`: `--app-header-h: calc(52px + env(safe-area-inset-top, 0px));`

## Fix 3 — GreetingStrip real bell + greeting
`src/components/home/workspace/GreetingStrip.tsx`:
- Add `useQuery` for unread notifications.
- Note: `admin_notifications` has no `read_by` column. Use a safer query: count rows where `created_at > profile.last_seen_at` and audience matches user, OR simply `select count where audience in ('all','authenticated')` minus a localStorage-tracked last-seen timestamp. Plan: query `select count` for visible notifications and compare against `localStorage["notif_last_seen"]`; show dot only if newer exist. (Avoids schema change.)
- Bell `to="/notifications"`.
- Time-based greeting: morning/afternoon/evening replaces "Welcome".
- Dot only renders when count > 0.

## Fix 4 — Remove GreetingStrip from mobile Home
`src/pages/Index.tsx`: wrap `GreetingStrip` in `hidden lg:block` (or move it out of mobile section). Mobile order: FlexiTopSection → ImageHeroSlider → QuickAccessGrid → product sections.

## Fix 5 — Elevated AI center pill in BottomNav
`src/components/layout/BottomNav.tsx`: for the AI item, wrap icon in an elevated rounded pill (gradient bg + shadow) that scales/changes on active. Hide the label span when AI tab is active.

## Fix 6 — ProductCard aspect ratio
`src/components/shop/ProductCard.tsx`:
- `aspect-video` → `aspect-[4/3]` (non-compact).
- `active:scale-[0.99]` → `active:scale-[0.97]`.

## Fix 7 — QuickAccessGrid 6 tiles, 3 cols
`src/components/home/workspace/QuickAccessGrid.tsx`: trim TILES to 6 (Continue, AI Tutor, Courses, Prompts, Earn, Mentors). Mobile + desktop grid → `grid-cols-3`. Keep ALL_TILES sheet untouched.

## Fix 8 — Per-tile gradients in FlexiTopSection
`src/components/home/mobile/FlexiTopSection.tsx`: add `from/to/iconColor` per pillAction (blue/violet/primary/amber). PillTile uses `bg-gradient-to-br ${t.from} ${t.to}`, icon uses `t.iconColor`.

## Fix 9 — Game quick action colors
`src/pages/Game.tsx`: add `color` field to each quick action (amber/blue/violet/emerald), apply via `cn("h-5 w-5", action.color)`.

## Technical details

- All new queries use typed supabase client; no `as any`.
- Like/comment counts via PostgREST: `post_likes(count), post_comments(count)` then read `.[0].count`.
- Skeletons use existing `Skeleton` from `@/components/ui/skeleton`.
- Empty/error CTAs use existing `Button` variants and `useNavigate`.
- No DB migrations.
- No changes to AdminGuard, /asikonasik, RLS, DesktopHeader, design tokens, or fonts.

## Files touched
- src/components/community/tabs/{MyFeedTab,PostsTab,VideosTab,ShortsTab,ReviewsTab}.tsx
- src/components/layout/MobileHeader.tsx
- src/index.css
- src/components/home/workspace/GreetingStrip.tsx
- src/pages/Index.tsx
- src/components/layout/BottomNav.tsx
- src/components/shop/ProductCard.tsx
- src/components/home/workspace/QuickAccessGrid.tsx
- src/components/home/mobile/FlexiTopSection.tsx
- src/pages/Game.tsx
