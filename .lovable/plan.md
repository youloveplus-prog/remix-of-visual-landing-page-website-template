
# Content Library — Digital Products, Courses, Services

A unified backend powers three polished admin sections. Items can be free or paid; access is granted via the existing `orders` flow. Storefront pages list and play/download purchased content.

## Architecture

```
content_items (shared) ──┬── content_assets (videos/images/pdfs/files)
                         ├── content_purchases (per-user access)
                         ├── course_modules ── course_lessons
                         └── service_details (bookable | deliverable)
```

One shared "content_items" table keeps catalog, pricing, search, and ordering uniform. Type-specific tables extend it for courses and services.

## Database (migrations)

**`content_items`** — shared catalog row
- `kind` enum: `digital` | `course` | `service`
- `title`, `slug`, `summary`, `description_md`, `cover_url`, `gallery` (text[])
- `price`, `original_price`, `currency` ('BDT'), `is_free`, `access_kind` ('lifetime' | 'subscription' coming later)
- `category`, `tags[]`, `level` (beginner/…)`, `language`, `duration_min`
- `status` ('draft'|'published'|'archived'), `is_featured`, `display_order`
- `instructor_id` (uuid → profiles, for courses/services)
- `published_at`, timestamps

**`content_assets`** — many per item
- `item_id`, `lesson_id` (nullable, for course lessons), `kind` ('video'|'image'|'pdf'|'audio'|'zip'|'other'), `url`, `storage_path`, `mime`, `size_bytes`, `duration_sec`, `position`, `is_preview`

**`course_modules`** — `item_id`, `title`, `summary`, `position`
**`course_lessons`** — `module_id`, `item_id`, `title`, `content_md`, `video_asset_id`, `duration_min`, `position`, `is_preview`

**`service_details`** — `item_id`, `mode` ('bookable'|'deliverable'), `delivery_days`, `session_minutes`, `max_revisions`, `included` (jsonb)

**`content_purchases`** — `user_id`, `item_id`, `order_id`, `granted_at`, `expires_at` (nullable). Unique on (user_id, item_id).

**`lesson_progress`** — `user_id`, `lesson_id`, `item_id`, `completed_at`, `seconds_watched`.

**RLS summary**
- `content_items`: SELECT public for `status='published'`; admins manage all.
- `content_assets`: SELECT only if item is published AND (asset.is_preview OR user has purchase) OR admin.
- `course_modules`/`course_lessons`: SELECT if parent item is published; full lesson body only with purchase/preview.
- `content_purchases`: user reads own; insert via order trigger; admins read all.
- `lesson_progress`: user manages own rows.

**Storage buckets**
- `content-media` (private) — videos, pdfs, zips. Signed URLs on demand.
- `content-covers` (public) — cover images & gallery.

**Order integration**
- Add `item_kind` ('product'|'content') and `content_item_id` to `order_items` (nullable).
- Trigger on `orders.status → 'paid'` inserts `content_purchases` rows for any content order items.

## Admin (three polished pages, shared components)

Routes under `/asikonasik/`:
- `/asikonasik/digital` — Digital Products
- `/asikonasik/courses` — Courses
- `/asikonasik/services` — Services

Added to `adminNav.ts` with icons (Download, GraduationCap, Briefcase).

**Shared components** (`src/components/admin/content/`)
- `ContentTable.tsx` — searchable, filterable list (status, category, price band, featured)
- `ContentEditorSheet.tsx` — right-side sheet with tabs: Overview · Media · Pricing · Publishing
- `MediaUploader.tsx` — drag-and-drop multi-file upload (videos/images/pdfs/zips), progress bars, reorder, preview toggle, delete; uses `supabase.storage` resumable upload for large videos
- `CoverPicker.tsx` — cover + gallery management
- `RichTextEditor.tsx` — markdown editor with preview (reuse existing if present)
- `PricingBlock.tsx` — free toggle, price, compare-at, featured

**Courses-only**: `CurriculumBuilder.tsx` — modules & lessons with drag-to-reorder, per-lesson video upload + content + preview flag.
**Services-only**: `ServiceModeSwitch.tsx` — bookable (session minutes, capacity) vs deliverable (delivery days, revisions, included list).

UI keeps the existing liquid-glass admin style (`GlassPanel`, `SectionHeader`, `Reveal`, sticky toolbar, mobile cards / desktop table mirroring `AdminProducts.tsx`).

## Storefront (user app)

Routes:
- `/learn` — already exists; extend to list published courses from `content_items` where `kind='course'`.
- `/library` (new) — "My Library": purchased items grouped by kind, with continue-learning row.
- `/courses/:slug`, `/digital/:slug`, `/services/:slug` — public detail pages with hero, preview lessons/files, pricing, "Add to cart" or "Free — Get access".
- `/courses/:slug/learn/:lessonId` — player page (video + markdown + next/prev + progress).
- `/services/:slug` — booking form (bookable) or order CTA (deliverable).

**Access enforcement**: client checks `content_purchases`; protected asset URLs are signed by an edge function `get-asset-url` that verifies purchase or admin/preview.

**Discovery**: Home gets a "Featured courses" carousel section (admin toggleable via existing `home_sections`).

## Edge functions

- `get-asset-url` — input: `asset_id`; verifies access via RLS-aware query; returns short-lived signed URL.
- `grant-content-access` — invoked by order webhook/trigger fallback for idempotent purchase grants.

## Implementation order

1. Migrations: tables, RLS, GRANTs, buckets, triggers.
2. Edge function `get-asset-url` + secrets check.
3. Admin shared components + Digital Products admin page.
4. Courses admin (curriculum builder).
5. Services admin (mode switch).
6. Storefront: detail pages, library, course player, home section.
7. Cart/Checkout: accept `content_item_id` items; on paid order → grant access.

## Out of scope (flag for later)

- Subscriptions / recurring access
- Certificates & quizzes
- Live cohorts / Zoom integration
- Stripe payments (current flow is COD/manual; can layer Stripe later)

## Open question

Do you want a real payment gateway (Stripe) wired in now for paid digital content/courses, or keep the existing manual/COD-style order flow and add Stripe later?
