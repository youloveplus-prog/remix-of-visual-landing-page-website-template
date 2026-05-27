# Phase 16 — Unified AI Page Header + Bottom-Anchored Mobile Composer

The `/learn` (Apu AI Tutor) page currently stacks two headers on top of each other:

```text
┌─────────────────────────────────────────────┐
│  ← [menu]  Apu · AI Tutor          [+]      │  ← TopBar (Learn.tsx)
├─────────────────────────────────────────────┤
│  [☰] 🟢 Thread title          [✎] [⋯]      │  ← LearnChat header
├─────────────────────────────────────────────┤
│                                             │
│              transcript                     │
└─────────────────────────────────────────────┘
```

This wastes ~56px of vertical space on mobile, duplicates the new-chat affordance, and makes the persona feel buried.

## Goal

One unified header that carries back navigation, thread switcher, persona, thread title, and chat actions. Composer stays glued to the bottom of the viewport on mobile, above the safe-area inset, and never floats away when the keyboard opens.

## Changes

### 1. `src/pages/Learn.tsx`
- Remove the outer `TopBar` and `LearnSkeleton` `TopBar` render from the signed-in path. Keep them only for the **loading** and **signed-out** states (those don't mount `LearnChat`).
- Pass a new `onBack` prop into `<LearnChat />` so the consolidated header owns back navigation.
- Drop the local `mobileMenu` Sheet (LearnChat already owns its own thread switcher Sheet — no need to duplicate).

### 2. `src/components/learn/LearnChat.tsx`
- Accept `onBack?: () => void` prop.
- Update the existing header (the calm hairline bar at line 276) to be the single source of truth:
  - Left cluster: `←` back button (lg:hidden if we want; keep visible on all sizes for consistency) + existing `PanelLeft` thread sheet trigger (mobile only).
  - Center: existing ringed avatar + thread title + "Apu · your ASIKON tutor" subtitle.
  - Right: existing `PenSquare` new-chat + `MoreHorizontal` menu.
- Keep the header `shrink-0` and inside the `flex flex-col h-full` root so the composer naturally pins to the bottom.

### 3. Mobile composer anchoring
- The composer wrapper at line 404 already uses `pb-[max(0.5rem,env(safe-area-inset-bottom))]` and `shrink-0`. Confirm it stays the last flex child and the parent `StandaloneShell` keeps `fixed inset-0 flex flex-col` so the composer sits flush at the bottom of the visual viewport. The existing `--app-vh` visualViewport handler stays.
- No new sticky/fixed positioning required — the `fixed inset-0` shell + flex column already pins the composer to the bottom on mobile.

## Out of scope

- No changes to the chat transport, message rendering, thread CRUD, quick prompts, empty state, or styling tokens.
- No new routes, no header redesign beyond merging the two — same calm Apple-quiet identity from Phase 15.
- Signed-out and loading screens keep the simple `TopBar` (they don't render `LearnChat`).

## Files touched

- `src/pages/Learn.tsx`
- `src/components/learn/LearnChat.tsx`
