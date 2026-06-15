# Desktop header refinement

## The actual bug
`MegaMenu` is gated `hidden lg:flex` (≥1024px). On any narrower desktop window the entire left side of `SlimDesktopHeader` and `DesktopHeader` collapses to nothing — search floats alone and the header reads as broken/empty (exactly what the screenshot shows). There is also no brand mark, no page context, and the bar lacks visual weight.

## Scope
All three desktop headers, so they share one system:
- `src/components/layout/SlimDesktopHeader.tsx` (non-home, e.g. /shop)
- `src/components/layout/DesktopHeader.tsx`
- `src/components/layout/HomeTopHeader.tsx`

Mobile headers untouched. No business logic changes.

## What changes (visual / presentation only)

1. **Brand lockup on the left (always visible)**
   - Small ASIKON mark + wordmark linking to `/`, sized to the row height.
   - Acts as the anchor so the header is never blank when MegaMenu collapses.
   - Subtle hover ring using `--gradient-primary`.

2. **MegaMenu visibility fix**
   - Drop the `hidden lg:flex` gate inside `MegaMenu` and let the consumer decide.
   - Show MegaMenu from `md` (≥768px) upward in the slim/desktop headers.
   - Below `md`, render a compact "Browse" dropdown trigger (same PANELS data, single button) so the nav never disappears entirely on narrow desktop windows.

3. **Row composition (Row 1)**
   ```text
   [Logo] · [MegaMenu / Browse]   ———   [Search ▸ max-w-md]   [Currency] [Cart] [Bell] [Theme] | [User]
   ```
   - Search shrinks to `max-w-md` so the menu has breathing room.
   - Vertical divider before user menu kept.
   - Heights normalized to `h-11` row, actions `h-9 w-9` rounded `xl`.

4. **Surface polish**
   - Cream/black theming via existing tokens (no hardcoded colors).
   - Stronger hairline + soft inset highlight at top edge.
   - At rest: `bg-background/75 backdrop-blur-2xl`.
   - On scroll: tighten to `py-1.5`, add the existing elegant shadow, fade hairline up.
   - Remove redundant inline `linear-gradient` style; move to a single `.app-header-surface` utility in `index.css` for consistency across all three headers.

5. **Row 2 (breadcrumbs / context)**
   - Slim breadcrumbs row stays but gains a right-aligned **page title chip** (current route's primary label from existing `Breadcrumbs` data) so pages like `/shop` aren't an empty strip.
   - Collapses on scroll exactly as today.

6. **HomeTopHeader parity**
   - Mirror the brand + MegaMenu/Browse pattern so home and inner pages feel like one system. Keep its existing translucent-over-hero treatment.

## Technical notes
- New small component `src/components/layout/HeaderBrand.tsx` (logo + wordmark).
- New `BrowseMenu` (compact dropdown reusing `PANELS` from `MegaMenu.tsx`) exported from `MegaMenu.tsx`.
- Add `.app-header-surface` and `.app-header-surface-scrolled` to `index.css`.
- No route, data, or auth changes. No new dependencies.
- Build check after edits (`tsc --noEmit` runs automatically).

## Out of scope
- Product card layout, shop grid, filters.
- Mobile header.
- Sidebar.
