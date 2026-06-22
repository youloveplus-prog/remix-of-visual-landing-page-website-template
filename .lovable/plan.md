# Higgsfield-style Mobile Header

Match the reference exactly on the mobile home/landing experience: dark bar, brand mark + wordmark on the left, two pill buttons on the right (white "Log in" + brand-filled "Get started"). Auth-aware so signed-in users see their menu/profile pill instead.

## Visual spec (from reference)
- Bar: pure black background, ~56px tall, no border, sits flush above the hero.
- Left: rounded-square white tile (40px) with brand glyph + bold "Asikon" wordmark beside it. Tap → home.
- Right (signed-out): two pills, 44px tall, fully rounded.
  - "Log in" — solid white pill, near-black text. Tap → `/auth`.
  - "Get started" — solid `primary` (indigo) pill, white text. Tap → `/auth?mode=signup`.
- Right (signed-in): single avatar/menu pill (existing user menu), no auth buttons.
- Inner routes keep the existing back-button + page-title header (unchanged).

## Implementation
Edit only `src/components/layout/MobileHeader.tsx`:

1. Add a `transparent` mode that activates on home-tab / landing routes:
   - Black bar always (not theme background), no blur, no border.
   - Skip the search + cart icons on home-tab; they live elsewhere on the page.
2. Replace center logo block with a left-aligned brand cluster:
   - 40×40 white rounded-[12px] tile, brand logo inside, +  `font-display font-bold text-[18px] text-white` wordmark.
3. Add right-side auth cluster:
   - Read `user` from `useAuth`.
   - If `!user`: render `Log in` (white pill, `text-black`) + `Get started` (`bg-primary text-primary-foreground`) — both `h-10 px-5 rounded-full text-[14px] font-semibold`, gap-2.
   - If `user`: render the existing `UserMenu` (avatar pill) so signed-in flow stays intact.
4. Keep the existing back-button + title for `isInnerRoute(pathname)` — only the home-tab variant changes.
5. Preserve safe-area padding, measured-height hook, and 44px tap targets.

## Out of scope
- No desktop header change.
- No new routes or auth logic — pills just link to the existing `/auth` page.
- No change to icons used on inner pages.
