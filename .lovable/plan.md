## Goal
Replace the current 2×2 uniform category grid (Courses / Books / Prompts / Trending) with an asymmetric bento layout inspired by the Smartx reference card — clean white/surface cards, varied sizes, brand label on top, large bold title, supporting stats/meta row, and a product/illustration anchor.

## Scope
File: `src/pages/Index.tsx` — only the `quick_categories` renderer (lines 167–191). No data, routing, or business logic changes. Stays theme-aware (light + dark Midnight Indigo).

## New layout

```text
+-----------------------+----------------+
|                       |    Books       |
|       Courses         |   (small)      |
|       (hero)          +----------------+
|                       |   Prompts      |
|                       |   (small)      |
+-----------------------+----------------+
|              Trending (wide)           |
+----------------------------------------+
```

- Grid: `grid-cols-3 grid-rows-2 gap-3`
- Courses tile: `col-span-2 row-span-2` — large headline ("Courses"), brand eyebrow ("ASIKON"), bottom meta row with two stats (e.g. "120+ Lessons" / "AI Tutor"), icon orb in top-right
- Books tile: `col-span-1` — small, icon top-right, label bottom-left
- Prompts tile: `col-span-1` — same compact pattern, accent dot ("Connected"-style status chip)
- Trending tile: `col-span-3` — wide strip, icon left, title + "Explore" arrow right

## Visual treatment

- Use `midnight-tile` base (already theme-aware: white surface in light, `#141432` in dark)
- Eyebrow: `text-[10px] uppercase tracking-widest text-muted-foreground font-semibold`
- Title: `font-display font-bold text-xl` (hero) / `text-sm` (small)
- Icon chips: `rounded-xl bg-primary/10 text-primary` (small), hero gets `bg-primary text-primary-foreground` with primary glow shadow
- Hero tile gets a subtle `midnight-glow` radial blob in the corner
- Status pill on Prompts tile: tiny green dot + "Live" text, matches reference's "Connected" pattern
- Hover: keep existing `pressable` + `focus-ring`

## Mapping
Use existing `quickCategories` array order (Courses, Books, Prompts, Trending). Render by index rather than `.map` to assign variant per slot.

No new dependencies. No token changes — reuses existing semantic tokens and `.midnight-tile` / `.midnight-glow` utilities.
