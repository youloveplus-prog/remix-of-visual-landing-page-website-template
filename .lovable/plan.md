## Issue

The Explore tab's "outline" icon (compass) in `src/components/layout/BottomNav.tsx` is actually drawn with `fill="currentColor"` on both paths, so it renders as a solid filled shape even when the tab is inactive — visually identical to the active/fill state. Every other tab (Home, Shop, Learn, Profile) uses true stroked outlines for the inactive state.

## Fix

Replace the `ExploreOutline` SVG (lines 9–20) with a stroke-based compass icon matching the visual weight of the other outline icons:

- Outer circle drawn as `stroke="currentColor"` with `strokeWidth={1.5}` and `fill="none"` (using 24×24 viewBox to match siblings).
- Compass needle drawn as a stroked diamond/polygon with `strokeLinejoin="round"` and `fill="none"`.
- Remove the center dot fill so nothing inside the icon is filled when inactive.

Keep `ExploreFill` (active state) unchanged — it should remain a solid filled compass.

No changes to colors, layout, labels, badges, or any other tab. Active-state behavior (switches to `ExploreFill` when `/shop` is selected) stays the same.

## Verification

After the change, rerun `tests/visual/bottom-nav-blue.spec.py` to confirm color tokens are unaffected, and visually confirm on `/profile` (current route) that the Explore icon now appears as a hollow outline while Profile remains filled.
