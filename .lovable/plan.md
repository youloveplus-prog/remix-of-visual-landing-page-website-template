## Goal
Turn the mobile bottom navigation bar into a solid brand-blue surface with white icons and labels.

## Changes

**1. `src/components/layout/BottomNav.tsx`**
- Replace the `liquid-nav` glass class on the `<nav>` with a solid brand-blue surface: `bg-primary`, no top border (or `border-primary-foreground/10`).
- Add a subtle top sheen + soft shadow above the bar for depth.
- Icons + labels:
  - Inactive → `text-primary-foreground/70`
  - Active → `text-primary-foreground` (white) with an active "pill" highlight behind the icon (`bg-primary-foreground/15 rounded-full`) so the active tab stays distinguishable on a solid color.
- Badge: keep red-free; switch to `bg-primary-foreground text-primary` so it pops on blue.
- Filled icon variants use `stroke="hsl(var(--background))"` for inner cutouts (home line, shop magnifier dot, learn bookmark). On a blue bar this still works in dark mode (bg = black) but reads poorly in light mode (bg = cream). Swap those inner strokes to `hsl(var(--primary))` so the cutout matches the bar color in both themes.

**2. No global token changes**
- `--primary` stays brand blue; only the bottom-nav surface is hardcoded to `bg-primary`.
- `liquid-nav` (used by headers, sheets, drawers) is left alone so other surfaces keep the glass look.

## Out of scope
- Desktop sidebar / headers (still glass).
- Light/dark theme tokens.
- Admin bottom nav (separate component).

## Acceptance
- Mobile bar is a clean, solid `#3b4fe0` strip.
- Active tab clearly readable via white icon + soft white pill.
- Inactive tabs ~70% white, still legible.
- Cart badge visible on blue.