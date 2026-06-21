## Goal
Revert the mobile bottom nav background to follow the theme (black in dark mode, default light surface in light mode). Only the **icons and labels** should be brand blue.

## Changes — `src/components/layout/BottomNav.tsx`

**Background (revert to theme):**
- Remove `bg-primary`, the blue shadow, and the white sheen line.
- Restore `liquid-nav border-t border-border/40` so the bar uses the theme surface (pure black in dark mode, glass cream in light mode).

**Icons & labels (stay brand blue):**
- Active icon: `text-primary` (brand blue).
- Inactive icon: `text-primary/55` (faded blue).
- Active label: `text-primary font-semibold`.
- Inactive label: `text-primary/60`.
- Remove the white "active pill" highlight added previously (the blue bg is gone, so the contrast pill is unnecessary).

**Filled icon inner cutouts:**
- Switch the inner stroke/fill back to `hsl(var(--background))` so the cutout matches the bar background again (was set to `primary` when the bar was blue).

**Badge & dot:**
- Cart badge: back to `bg-primary text-primary-foreground ring-2 ring-background`.
- Unread dot: back to `bg-primary ring-2 ring-background`.

## Out of scope
- Global tokens, headers, sidebar, admin nav.

## Acceptance
- Dark mode: bottom nav is pure black; icons + labels are brand blue.
- Light mode: bottom nav uses the existing glass surface; icons + labels are brand blue.
- Active vs inactive still readable via opacity (100% vs ~55–60%).