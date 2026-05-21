# Plan

## 1. Fix header hiding content
The mobile header in `AppLayout.tsx` is `position: fixed` but `<main>` has no top padding, so the first section sits beneath it.
- In `src/components/layout/AppLayout.tsx`, add `paddingTop: var(--app-header-h)` to `<main>` on mobile (mirroring the existing `paddingBottom` pattern).
- In `src/components/layout/MobilePage.tsx`, reduce default top padding from `pt-3` to `pt-1` so Quick Access sits flush under the header.

## 2. Move Quick Access directly under header + tighten gaps
In `src/pages/Index.tsx` (logged-in branch):
- Reorder: `GreetingStrip` → `QuickAccessGrid` immediately after, then hero, mission, etc.
- Wrap top block in a tighter `space-y-2` group so Quick Access hugs the header.
- Reduce overall `MobilePage` spacing on mobile from `space-y-4` to `space-y-3`.

## 3. Liquid-glass Quick Access icons
In `src/components/home/workspace/QuickAccessGrid.tsx`, restyle the `Tile` chip:
- Replace solid brand gradient with a translucent glass surface: `bg-white/5 backdrop-blur-xl border border-white/10`, an inner highlight (`inset 0 1px 0 hsl(var(--glass-highlight)/0.18)`), and a soft primary glow (`shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.55)]`).
- Add a subtle radial primary tint inside the chip so the brand color reads without solid fills.
- Icon color → `text-primary` (instead of `text-primary-foreground`), strokeWidth `2`.
- Slightly smaller chip (`48×48` mobile) and tighter row gap (`gap-2`) to reduce vertical footprint.
- Hover: lift + brighten glass (`bg-white/10`, stronger glow); active scale stays.

## 4. Redesign "Ask the AI tutor" — shorter, with teacher image
In `src/components/home/workspace/AiAssistantBox.tsx`:
- New two-column layout on mobile: left ~64px circular teacher avatar (glass ring + primary glow), right column with title + input.
- Drop the standalone icon header row — merge title beside the avatar to cut height.
- Compact input row (h-9), single-line suggestion chips in a horizontal scroller (no wrap) → reduces height further.
- Container padding `p-3` (was `p-4`), `rounded-2xl`, keep gradient soft background but add subtle glass + ring.
- Teacher image: generate a friendly tutor portrait via imagegen → `src/assets/ai-tutor.jpg` (square, warm, on-brand red gradient bg). Use `SmartImage` for lazy loading.

Estimated height reduction: ~35–40%.

## Technical notes
- Files touched: `AppLayout.tsx`, `MobilePage.tsx`, `Index.tsx`, `QuickAccessGrid.tsx`, `AiAssistantBox.tsx`, new asset `src/assets/ai-tutor.jpg`.
- All colors via semantic tokens (`--primary`, `--glass-highlight`, `--background`). No hard-coded hex.
- No business-logic changes; presentation only.
