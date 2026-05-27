## Problem

On a 393px mobile viewport, the main app pages (Home, Community, Profile, Cart, Orders, Game, LessonDetail, Notifications, Wishlist, Checkout, TrackDetail, OrderDetail, ProductDetail) show large empty gutters on the left and right. The cause is double padding in `src/components/layout/MobilePage.tsx`:

- `widthClass` is set to `container-editorial`, which already includes `px-4 sm:px-6 lg:px-8` (defined in `src/index.css`).
- The same wrapper then ALSO appends `px-4 sm:px-6 lg:px-8`.

Result: 32px gutters on mobile (16px + 16px) and 64px on desktop, instead of the intended 16px / 32px. Content cards lose roughly 32 horizontal pixels — very noticeable on a 393px screen.

## Fix

Edit `src/components/layout/MobilePage.tsx` so padding is only applied once:

- When `widthClass === "container-editorial"` → do NOT add the extra `px-4 sm:px-6 lg:px-8`. The container already provides it.
- When using a `max-w-*` width (standard / reading / sm…6xl) → keep `padded && "px-4 sm:px-6 lg:px-8"` because those branches don't include built-in padding.
- Apply the same rule to the `sticky` wrapper directly above it.

Concretely, replace the two `cn(widthClass, padded && "px-4 sm:px-6 lg:px-8", …)` lines with a computed `paddingClass` that is empty when `isContainer` is true and `"px-4 sm:px-6 lg:px-8"` otherwise.

## Out of scope

- No changes to `container-editorial` itself (other pages like Shop, Mentors, About, Leaderboard, Contact, Help use it directly and are already correct at 16px mobile gutters).
- No restyling of cards, tabs, headers, or per-page layouts.
- No changes to admin layout, Welcome, Auth, NotFound, ResetPassword.

## Verification

After the edit, reload `/`, `/community`, `/profile`, `/cart` on the 393px preview and confirm content stretches to ~16px from each edge (single gutter), not ~32px.
