# Modernize Quick Categories Bento

Refresh the 4-tile bento section on Home (`src/pages/Index.tsx`, `quick_categories` renderer, lines ~183-267) — Courses hero, Books, Prompts, Trending wide — with a more modern, tactile, clearly-clickable look using the existing dark-red brand gradient.

## Visual changes

**Courses hero (large 2x2 tile)**
- Replace flat `midnight-tile` with a layered gradient surface: brand gradient base + soft inner highlight + animated conic shine on hover.
- Larger icon badge (44px) with primary-foreground glyph on solid primary, double-ring glow.
- Add a small "Start learning →" pill chip in the bottom-right corner as an explicit CTA affordance.
- Stats row (120+ Lessons / 24/7 AI tuor) gets vertical divider + tabular-nums for crisper numerics.

**Books & Prompts (small tiles)**
- Two-tone gradient cards (one cool-tinted, one warm-tinted) using primary at different opacities so the row reads as a palette, not two identical chips.
- Icon moves to a filled rounded square (not faint outline), with a tiny arrow indicator that slides on hover.
- Replace static "Read" / "Live" labels with status dots + label kept in the eyebrow style established last turn.

**Trending wide tile**
- Convert into a true CTA row: animated gradient underline, chevron that translates on hover, subtle marquee shimmer behind the icon.
- Add an active-state press (`active:scale-[0.98]`) so tap feels physical on mobile.

**Shared polish**
- All tiles get: `transition-all duration-300`, `hover:-translate-y-0.5`, `hover:shadow-[0_18px_40px_-18px_hsl(var(--primary)/0.55)]`, `active:scale-[0.98]`, visible focus ring.
- Consistent 16px (`rounded-2xl`) radii, 1px border that brightens to `border-primary/40` on hover.
- Stagger entry with `animate-fade-in` + per-tile delay (60ms).

## Technical notes

- All edits scoped to the `quick_categories` renderer inside `src/pages/Index.tsx`. No new files, no token changes — uses existing `--primary`, `--gradient-primary`, `midnight-tile`, `midnight-shine`, `midnight-glow` utilities.
- Keep existing `Link` `to` targets, icons, and the `Eyebrow` helper untouched.
- No data/business-logic changes; presentation only.
- Respects the section-header restyle from the previous turn (small uppercase tracked muted labels).

## Out of scope

- Other home sections (hero, trending carousel, community, etc.).
- New routes or content.
- Color token edits in `index.css`.
