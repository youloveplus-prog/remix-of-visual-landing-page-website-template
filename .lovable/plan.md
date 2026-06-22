## Goal

Replace the mock "Happening right now" feed with real activity pulled from the database, and give admins a control panel to (a) choose which event types are broadcast and (b) push pinned announcements that appear on every user's home screen.

## What gets built

### 1. Real live activity feed (Home)

Aggregate the latest events from existing tables — no schema changes for the feed itself:

- **Purchases** — `orders` (paid) + `order_items` joined to `products` for the item name
- **Reviews** — `product_reviews` joined to `products`
- **Enrolments** — `content_purchases` joined to `content_items` (or `lesson_completions` as a fallback for "milestones")
- **Display name / location** — `profiles.display_name` (first name only, last initial for privacy: "Ayesha R.")

A single `useLiveActivity()` hook (React Query, 30s refresh + Realtime subscription) merges all three sources, sorts by recency, and exposes the last ~20 events. `LiveActivityFeed` and `LiveActivityToaster` consume the same hook; mock generator is removed.

Privacy: never show full name, email, or precise location — only first name + last initial, plus the public product/lesson title.

### 2. Admin-controlled notification settings

New table `live_activity_settings` (singleton row, admin-only writes, public read):

- `purchases_enabled`, `reviews_enabled`, `enrolments_enabled`, `milestones_enabled` (bool)
- `toast_enabled` (bool) — controls whether the periodic sonner toast fires at all
- `toast_interval_seconds` (int, default 18)
- `feed_window_hours` (int, default 24) — only show events newer than this

`useLiveActivity` honors these toggles client-side; `useLiveActivityToaster` reads `toast_enabled` and `toast_interval_seconds`.

### 3. Admin-pushed home announcements (force-push)

New table `home_announcements`:

- `title`, `body`, `level` (info/success/warning/promo), `link` (optional CTA url)
- `is_active`, `is_pinned` (bool) — pinned ones render as a sticky banner at the top of the feed section
- `show_as_toast` (bool) — also fires a one-time toast on first view per session
- `starts_at`, `ends_at` (timestamps, both optional)
- `created_by`, `created_at`, `updated_at`

A new `useHomeAnnouncements()` hook subscribes via Realtime, returns currently-active rows, and:

- Renders pinned ones as a dismissible banner above the live feed
- Fires a toast for `show_as_toast` rows the user hasn't seen yet (tracked in `sessionStorage` by id)

### 4. Admin UI

New page **`/asikonasik/live-activity`** (`AdminLiveActivity.tsx`), added to the Admin nav under "Admin" section with a Megaphone icon:

- **Settings card** — toggles + interval slider, saves to `live_activity_settings`
- **Announcements card** — list + create/edit/delete dialog with the fields above; "Force push now" button sets `is_active=true`, `is_pinned=true`, `show_as_toast=true`, `starts_at=now()`
- Live preview pane on the right showing how it will appear on the home screen

All writes audited via the existing `useAuditLog` hook.

## Database changes

```text
live_activity_settings  (singleton, id = 'global')
home_announcements      (full CRUD, admin-only writes)
+ Realtime on home_announcements
+ Standard GRANTs + RLS:
   - settings: public SELECT, admin write
   - announcements: public SELECT where is_active, admin full
```

## Files

New
- `supabase` migration — two tables + RLS + realtime
- `src/hooks/useLiveActivity.ts`
- `src/hooks/useLiveActivitySettings.ts`
- `src/hooks/useHomeAnnouncements.ts`
- `src/pages/admin/AdminLiveActivity.tsx`
- `src/components/home/higgsfield/HomeAnnouncementBanner.tsx`

Edited
- `src/lib/live-activity.ts` — keep formatting helpers, drop mock generator
- `src/components/home/higgsfield/LiveActivityFeed.tsx` — consume real hook + banner
- `src/components/home/LiveActivityToaster.tsx` — honor settings + announcement toasts
- `src/pages/Index.tsx` — render banner above feed
- `src/pages/admin/adminNav.ts` + admin routes — add Live Activity entry
- `src/App.tsx` (or admin router) — register the new admin route

## Out of scope (ask later if you want)

- Per-user notification preferences (this plan is app-wide)
- Push notifications / email — this is in-app only
- Geo-IP lookup for real city names (kept as profile-only, no IP tracking)
