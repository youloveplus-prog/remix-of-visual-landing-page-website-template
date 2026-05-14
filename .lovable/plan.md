## Goal
1. Reskin `/asikonasik` admin to match the user app (glass, gradients, Reveal, premium buttons, consistent typography).
2. Add missing admin features so the panel can actually run the platform.
3. Speed up the whole app by removing render/network bottlenecks.

---

## Part 1 — Admin UI/UX redesign

Reuse existing tokens and components: `glass`, `glass-strong`, `gradient-primary`, `pressable`, `hover-lift`, `Reveal`, `SectionHeader`, `Price`, `SmartImage`, `Button variant="premium"`, `Skeleton`.

**Shell** — `AdminLayout.tsx` + `AdminBottomNav.tsx`
- `glass-strong` header and sidebar background using `--gradient-surface`.
- Sidebar: rounded pill nav items, gradient icon tile for the active item, `glow-primary` ring on hover, ⌘K command palette in header.
- Header: breadcrumb + page title with `text-gradient`, notification bell with badge, avatar menu (Profile / Sign out / Switch to user app).
- Bottom nav: floating `glass-strong` pill matching the user `BottomNav`, active indicator using the `enter` keyframes.
- Wrap each page body in `Reveal`.

**403 screen** — `AdminGuard.tsx`
- Upgrade to `glass-strong` card, `gradient-primary-soft` halo, `Button variant="premium"`.

**Page-level reskin**
- `SectionHeader` for titles + subtitle + optional action.
- Replace `Card` with `glass` panels (rounded-2xl, soft shadow).
- Tables wrapped in `glass`, sticky header, zebra rows, `bg-muted/40` row hover, friendly empty-state block.
- Skeletons that match real row heights (no layout jump).

**New functionality per page**

| Page | Adds |
|---|---|
| Overview | KPI cards with today-vs-yesterday deltas, lightweight inline SVG sparklines, recent activity feed (latest orders, posts, signups), revenue total, low-stock alerts. |
| Users | Search, role-filter chips, promote/demote with confirm dialog, ban/unban, trust score editor, CSV export. |
| Products | Edit dialog, bulk feature toggle, image upload via Supabase Storage, category filter, search, stock badge, sort. Move create form into a slide-over `Sheet`. |
| Categories | Inline rename, drag-handle re-order, icon picker. |
| Orders | Status filter tabs, per-order detail drawer (line items, buyer, address), mark-as-shipped, revenue summary. |
| Community | Tabs for Posts / Comments / Reports, soft-delete with reason, pin/feature toggle. |
| POD Designs | Approve/reject with reason textarea, preview lightbox, status filter, sales leaderboard. |
| Settings | Maintenance mode, COD toggle, trust strip toggle, default coin grant, super-admin-only "Add admin by email", Supabase dashboard links. |

**Migration** — small additive schema:
- `posts.is_pinned bool default false`
- `profiles.is_banned bool default false`
- `categories.display_order int default 0`
- `app_settings` key/value table for the new toggles
- New RLS policies allowing admin writes on `products`, `categories`, `orders`, `posts`, `pod_designs`, `user_roles`, `profiles.is_banned`, `app_settings` via `has_role(auth.uid(),'admin')`.
- New `public` storage bucket `product-images` + admin-write RLS.

---

## Part 2 — Performance optimization

**Network / data**
- `placeholderData: keepPreviousData` on paginated/list queries.
- Trim `select('*')` in hot paths (`useProducts`, admin lists) to only the columns the UI uses.
- Parallelize Overview counts in a single `Promise.all`/RPC instead of 6 separate `useQuery` hooks.
- Append `?width=…&quality=70` Storage transforms for product/avatar thumbnails.

**Bundle / JS**
- Replace `recharts` for sparklines with a ~2 KB inline SVG component; keep `recharts` lazy-loaded only if a real chart appears.
- Audit icon imports — keep named imports tree-shakeable.
- `React.memo` on `PostCard`, product card cell, admin table row.
- `useMemo` on stable list transforms.

**Rendering / runtime**
- Explicit `width`/`height` on `SmartImage` in product grids (kill CLS).
- `loading="lazy"` + `decoding="async"` on non-LCP images; `fetchpriority="high"` on hero.
- Replace per-item `Reveal` IntersectionObservers in long grids with a single shared observer.
- Debounce search inputs with `useDeferredValue`.
- Add `build.target: 'es2020'` in `vite.config.ts`.

**Verification**
- After implementation, run `browser--performance_profile` on `/`, `/shop`, `/asikonasik` to confirm fewer long tasks, lower JS heap, faster INP, and check network for smaller product payloads.

---

## Out of scope
- Real-time presence/notifications.
- Edge-function-based admin actions (RLS + role checks suffice).
- Reskin of user-facing pages.
