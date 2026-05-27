## Re-skin `FlexiTopSection` to ASIKON midnight bento

The section uses arbitrary rainbow gradients (blue/emerald/teal/violet/rose) that fight the Midnight Indigo + `midnight-tile` language used everywhere else on home. Replace with the project's existing tokens.

### Changes (single file: `src/components/home/mobile/FlexiTopSection.tsx`)

1. **Pill tiles** — drop per-tile multicolor gradients. Use one consistent treatment:
   - `midnight-tile` square (rounded-2xl, 56–60px), subtle inner gradient `from-primary/15 to-primary/5`, 1px `border-primary/20`, primary-tinted icon.
   - Hover/active: lift -2px, primary glow shadow, icon scales 1.08.
   - Labels: `text-foreground/85`, same weight across all four.

2. **Split CTA card** — keep the gradient-primary left panel (this IS the brand accent), but:
   - Right stat panel: replace blue/emerald icon chips with neutral `bg-primary/10 text-primary` chips so it reads as one ASIKON card, not a stitched-together collage.
   - Add `midnight-shine` to the whole card (already on outer); remove `float-y` blob, replace with a soft static `midnight-glow`-style radial.
   - Tighten copy: "Start learning today" → keep; subline keep.

3. **Eyebrow + heading** — already aligned with GreetingStrip; keep as-is.

4. **Spacing** — `space-y-3` stays. Pills grid `gap-3` for breathing room matching `QuickAccessGrid`.

### Out of scope
- No new components, no token edits, no other files.
- Don't touch `QuickAccessGrid` / `GreetingStrip`.
