# Plan — 4 fixes in one pass

## 1. Fix blank published site (asikonpro.lovable.app)

Most likely cause for a Vite + Supabase project showing a blank page only on the published URL: the published bundle was built without `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`, or a recent change throws during initial render and there's no top-level error boundary on the route tree.

Steps:
- Open the published URL in the debug browser, capture console + network errors to confirm the actual failure (env-missing vs runtime throw vs lazy-chunk 404).
- If env: re-sync Supabase connection so `.env` is regenerated, then republish.
- If runtime throw: wrap `<AnimatedRoutes />` in `App.tsx` with an existing `ErrorBoundary` so a single broken lazy route can't blank the whole app, and fix the underlying throw.
- Verify by reloading the published URL after republish.

## 2. Promotional content uploader (admin)

Build a real uploader inside the existing `AdminBanners` page (and extend `AdminHomeSections` for promo strips) backed by Supabase Storage.

- New storage bucket `promos` (public read, admin-only write) via migration.
- New table `public.promotions` (title, subtitle, image_url, cta_label, cta_url, placement enum: `home_hero | home_strip | shop_banner | community_banner`, position int, active bool, starts_at, ends_at). RLS: public read of active rows, admin write. GRANTs per the rules.
- `PromoUploader` component in admin: drag-drop image, fields, live preview, schedule pickers. Writes to `promos` bucket and `promotions` table. All actions logged via existing `useAuditLog`.
- Surface active promos on the user side by reading `promotions` in the existing home/shop banner components — no visual changes to user pages, just real data instead of mock.

## 3. Admin mobile a11y pass

Targeted at `AdminBottomNav`, `AdminLayout` sticky filter chips, and `UserDetailDrawer` tabs.

- **Bottom nav**: add `role="tablist"` on the nav container, `role="tab"` + `aria-selected` + `aria-controls` on each `NavLink`, visible `focus-visible:ring-2 ring-primary` ring, `aria-current="page"` on active, `aria-label` on the More button, ensure 44×44 tap target (already met, just confirm). Keyboard: arrow-left/right to move between tabs, Enter to activate.
- **Filter chip bars** (Users / Orders / Products / Community): wrap in `role="toolbar" aria-label="Filters"`, each chip is a real `<button>` with `aria-pressed`, focus ring, scroll-into-view on focus.
- **UserDetailDrawer tabs**: convert to shadcn `Tabs` primitive (Radix) so keyboard nav + `aria-selected` come for free; add `aria-label` on icon-only row actions (ban, verify, force sign-out, send notification), confirm dialogs get proper `DialogDescription` (fixes the existing console warning).
- **Global**: replace any `h-screen` on admin shells with `h-dvh`; ensure all icon-only buttons across admin pages have `aria-label`.

## 4. Split user vs admin code

New top-level structure inside `src/`:

```text
src/
  admin/
    components/   ← from src/components/admin/**
    pages/        ← from src/pages/admin/**
    hooks/        ← admin-only hooks (useAuditLog, useUserRole stays shared)
  user/
    components/   ← user-facing feature components (community, shop, profile, home, learn, mentorship, messaging, product, search, game, profile, layout)
    pages/        ← from src/pages/*.tsx (all non-admin pages)
    hooks/        ← user-only hooks
  shared/
    components/ui/  ← shadcn primitives (untouched)
    components/transitions, ErrorBoundary, SEO, NavLink
    hooks/use-mobile, use-toast, use-scroll-*, useAuth, useProfile, etc.
    lib/, integrations/, types/, copy/, assets/
  App.tsx, main.tsx, index.css
```

- Update `tsconfig.app.json` paths: add `@/admin/*`, `@/user/*`, `@/shared/*` aliases while keeping `@/*` working for the transition.
- Update `vite.config.ts` alias map to match.
- Mechanical move with import rewrites via codemod (ripgrep + sed) batched per folder; verify build between batches.
- Update `App.tsx` lazy imports to the new locations.
- `components.json` shadcn alias stays pointed at `@/shared/components/ui` so future `shadcn add` writes to the right place.

## Order of execution

1. Debug + fix blank published site (highest priority, smallest change).
2. A11y pass (low risk, isolated to admin files).
3. Promo uploader (migration + bucket + UI).
4. User/admin split (last — biggest churn, run after the above are verified).

## Technical notes

- No changes to auth, roles, or RLS model beyond the new `promotions` table.
- Storage: `promos` bucket public for read so CDN URLs work; no broad SELECT on `storage.objects` (matches the security-memory rule from last pass).
- The split keeps `src/components/ui/` (shadcn) intact as `src/shared/components/ui/` — no shadcn primitives are rewritten.
- Memory will be updated to record the new folder convention and the promotions table after step 4 lands.