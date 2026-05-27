# Admin Panel — Mobile Redesign + Full User Control

The admin panel already has a bottom nav scaffold, but mobile pages still render desktop-style tables, headers feel cramped, and the Users page is missing some controls. This plan polishes mobile UI across all admin pages and gives the Users page complete control over every user-facing feature.

## 1. Mobile-first layout shell (`AdminLayout.tsx`)
- Slim the mobile header to a single 56px row: logo · page title · search icon · avatar. Move notifications & theme into the More sheet on mobile.
- Add a sticky **section sub-header** on mobile that shows current section ("Commerce › Orders") + a quick "Jump" pill that opens the command palette as a bottom sheet.
- Increase main bottom padding to clear the bottom nav + safe-area properly; remove desktop-only paddings on small screens.

## 2. Polished bottom navigation (`AdminBottomNav.tsx`)
- Switch to **5 fixed tabs + center floating "More"** layout (Overview, Users, Orders, Community, More). Active tab gets the liquid-glass pill we already use elsewhere with a subtle scale + haptic-style press.
- More sheet becomes a categorized grid (Content / Commerce / Admin / Settings) with search and recent items.
- Auto-hide on scroll down, reveal on scroll up (re-use `useScrollDirection`).

## 3. Mobile page polish (applies to every admin page)
Standard pattern applied to Products, Orders, Users, Tracks, Lessons, Categories, Mentors, Community, Rewards, Notifications, Banners, Home Sections, Audit Log, Analytics, Settings:
- Replace wide data tables with **card list view < md** (avatar/thumb · title · meta chips · right-side actions menu) while keeping the table on ≥ md.
- Sticky filter bar with horizontally-scrollable chip filters (role, status, date, category) instead of cramped selects.
- Floating action button (FAB) bottom-right above bottom nav for the primary action (New product, New track, etc.).
- Bulk-select via long-press on mobile → contextual action bar slides up from bottom.
- Skeleton + empty + error states standardised via existing `AdminPageSkeleton`.

## 4. Full user control (`AdminUsers.tsx` + `UserDetailDrawer.tsx`)
Make this page the single source of truth for everything tied to a user. From the row menu / detail drawer an admin can:
- **Identity**: edit username, full name, avatar, bio
- **Access**: change role (user / moderator / admin / super_admin — super_admin guarded), ban / unban with reason, verify / unverify, force sign-out
- **Wallet & rewards**: adjust coins (+/-), grant badges, view ledger
- **Commerce**: view orders, cancel/refund order, view wishlist, view cart
- **Content**: view & moderate their posts/reviews/videos/shorts, hide or delete with reason
- **Learning**: view enrolled tracks, lesson progress, reset progress
- **Mentorship**: view bookings & waitlist entries
- **Comms**: send direct notification, view notification history
- **Audit**: full activity timeline pulled from `audit_log`
- **Danger zone**: delete account (super_admin only, with typed confirm)

All destructive actions write to `audit_log` via the existing `useAuditLog` hook and show toast confirmations.

## 5. Visual polish
- Apply `glass-strong` to headers, drawers, and sheets consistently.
- Larger 44px tap targets everywhere on mobile.
- Use `motion-vendor` chunked framer-motion only for entrance + drawer slide (already loaded).
- Respect `prefers-reduced-motion`.

## Technical notes
- New shared component `src/components/admin/MobileListItem.tsx` for the card row pattern.
- New shared `src/components/admin/AdminFAB.tsx`.
- Extend `UserDetailDrawer` with tabs (Profile / Orders / Content / Learning / Wallet / Audit / Danger).
- No schema changes required — all controls map to existing tables (`profiles`, `user_roles`, `orders`, `posts`, `enrollments`, `audit_log`).
- Bottom nav scroll-hide reuses `useScrollDirection` already in repo.
