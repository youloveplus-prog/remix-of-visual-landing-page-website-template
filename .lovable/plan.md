# Improve Community Carousel Header & Surrounding UX

## Problem (current state)
The header stacks three elements awkwardly: a `LivePulse` chip, the `SectionHeader` title, and a "View all" link — all crammed in the center with tight `gap-2`. On mobile, "Live • From the community • View all" looks like a run-on. Hierarchy is flat, the live signal feels decorative, and the carousel controls below have no relationship to the header.

## Goals
1. Clear visual hierarchy: title is the hero, live count is supportive metadata, "View all" is an action.
2. Better use of horizontal space on tablet/desktop (title left, action right) while staying centered & calm on mobile.
3. Tie the carousel arrows into the header on desktop so navigation feels intentional, not orphaned below.
4. Improve the empty/skeleton states to match the same rhythm.

## Proposed Layout

### Mobile (sm and below)
```text
        ● 248 live now
     From the community
   Stories, wins, and AI ——
            experiments
       [ View all → ]
```
- Centered stack, generous `gap-3`.
- Add an optional one-line subtitle/eyebrow under the title for context.
- "View all" becomes a subtle ghost pill button instead of a tiny inline link → easier tap target (44px).

### Desktop (md+)
```text
●  From the community            ←  →   View all →
   248 creators live now
```
- Two-column flex: title block left, controls right.
- Live pulse becomes a small inline dot + count to the left of the title (or above as an eyebrow).
- Carousel prev/next arrows move up into the header row, sitting next to "View all". Removes the floating arrow cluster below the cards.

## Changes

### 1. `CommunityCarousel.tsx`
- Replace the centered header `div` with a responsive header:
  - `flex flex-col md:flex-row md:items-end md:justify-between gap-4`
  - Left: eyebrow (LivePulse, smaller) + `h2` title + optional subtitle (`text-sm text-muted-foreground`).
  - Right (md+): inline `[prev] [next]` arrows + `View all →` ghost button.
- Hide the bottom arrow row on `md+`, keep it on mobile (centered, same as today but with a subtle progress dot indicator between them showing slide position).
- Pass arrow controls as props/children instead of duplicating markup.

### 2. `SectionHeader` usage
- Drop `SectionHeader` here and inline a custom header so we control layout precisely. Keep `SectionHeader` for other sections.

### 3. `LivePulse`
- Add a `variant="inline" | "eyebrow"` prop so it can render small (dot + "248 live") without the chip background on desktop.

### 4. Carousel body
- Add slide progress dots on mobile under the cards (replaces the redundant arrow row when arrows move to header on desktop).
- Increase top spacing (`mt-6` instead of `mt-2`) so header has room to breathe.

### 5. Empty + Skeleton
- Match new header rhythm: align skeleton/empty card to the same left edge as the title (no centering shift).
- Empty state copy gets a friendlier two-line layout and a secondary "Browse community" link.

### 6. Accessibility
- Header arrows get `aria-controls` pointing to the carousel viewport id.
- Live region: `aria-live="polite"` on the live count so screen readers announce updates.
- Ensure focus ring on the new ghost "View all" button uses `focus-visible:ring-ring`.

## Out of scope
- PostCard visual changes.
- Feed data / hook behavior.
- Other sections using `SectionHeader`.

## Acceptance
- On 390px viewport: header is centered, title is the largest element, "View all" is a tappable pill, arrows sit under cards with a dot indicator.
- On ≥768px: title left with live eyebrow, arrows + view-all right; no duplicate arrow row below.
- Reduced-motion respected (already handled by autoplay).
- No regressions in skeleton/empty states.
