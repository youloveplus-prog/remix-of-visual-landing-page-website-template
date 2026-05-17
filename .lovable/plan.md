## Goal

Make the mobile bottom nav feel like a standard native app — flat, full-width, bottom-anchored — not a floating rounded pill. Refresh Home / AI / Profile icons to a more modern set.

## Changes (single file: `src/components/layout/BottomNav.tsx`)

**Container**
- Drop the floating pill: remove `max-w-lg`, `px-3 pb-3`, `rounded-[28px]`, outer shadow, gap.
- Make it a full-width flat bar pinned to the bottom edge:
  - `fixed inset-x-0 bottom-0 z-50`
  - `bg-background/95 backdrop-blur-xl`
  - `border-t border-border/60` (top divider only, no rounded corners, no outer margin)
  - Safe-area padding via `paddingBottom: env(safe-area-inset-bottom)`
  - Height ~56–60px (standard app bar). Items stretch with `grid grid-cols-5`.

**Items**
- Remove the colored "pill behind active icon" treatment that makes the AI tab oversized.
- New active state = popular-app pattern:
  - Icon + label both switch to `text-primary`
  - Stroke weight bumps to 2.4 on active
  - Thin 2px top indicator bar above the active item (like YouTube / X)
  - No background fill, no scale, no glow
- Inactive: `text-muted-foreground`, regular stroke
- Label always visible at `text-[10px]`, single line, centered
- Keep tap-scroll-to-top behavior

**Icons (modern set, all from lucide-react, already installed)**
- Home → `House` (rounded modern home, current `Home` is the classic outline)
- Explore → keep `Compass`
- AI → `Wand2` (modern AI/magic icon; replaces generic `Sparkles`)
- Community → keep `Users`
- Profile → `CircleUser` (modern avatar-style profile icon; replaces plain `User`)

**Layout safety**
- Confirm AppLayout already reserves bottom padding for mobile content; current value should still work since the new bar is similar height (~60px + safe-area).

## Out of scope
- Desktop sidebar (unchanged)
- Routes / tab list / active-tab logic in `nav-map.ts` (unchanged)
- Header / page content

## QA
- Verify at 393×701 (current preview): 5 icons evenly spaced, labels not truncated, active indicator visible, bar flush with screen edges.
- Verify safe-area inset on iOS-style notches (visual approximation via dev tools).
