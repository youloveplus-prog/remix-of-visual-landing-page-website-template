## Goal
On mobile, the AI Tutor page (`/learn` and `/learn/:threadId`) should keep the bottom navigation visible, and the chat area should fit exactly between the app header and the bottom nav (no overlap, no extra empty space).

## Current behavior
- `src/App.tsx` → `PersistentMobileShell` returns `null` whenever the path starts with `/learn/`, so the bottom nav disappears as soon as a thread is opened.
- `src/pages/Learn.tsx` wraps content in `AppLayout` (which adds `pb-28` to `<main>` on mobile when `showBottomNav` is true) and sets the chat container to `h-[calc(100dvh - header - 64px)]` on mobile — a height that assumed there was no bottom nav.
- Net effect on a thread: nav is hidden, and even if it were shown, the chat would be pushed down by `pb-28` and overlap with the nav.

## Changes

1. **`src/App.tsx` — `PersistentMobileShell`**
   - Remove the `if (pathname.startsWith("/learn/")) return null;` early-return so the bottom nav stays mounted on every `/learn` route on mobile.

2. **`src/pages/Learn.tsx`**
   - Keep `AppLayout` but pass `showBottomNav={false}` so `<main>` does not add the `pb-28` spacer (the persistent shell still renders the nav itself).
   - Update the chat wrapper height so the chat sits flush above the bottom nav:
     - Mobile: `h-[calc(100dvh - var(--app-header-h,56px) - var(--bottom-nav-h,64px))]`
     - Desktop unchanged.
   - The composer at the bottom of `LearnChat` will then end exactly above the bottom nav.

3. **Bottom nav height token (only if not already defined)**
   - Verify `--bottom-nav-h` is exposed by `BottomNav` / global CSS. If not, hardcode `64px` (current value) in the Learn height calc. No other pages depend on this change.

## Out of scope
- No visual restyling of the chat, composer, or bottom nav.
- No changes to other routes' nav behavior (auth, checkout, create, etc. still hide as before).

## Verification
- Mobile 393×800: open `/learn`, open a thread, scroll messages — bottom nav stays visible, composer sits just above it, no content hidden behind the nav, no large gap.
- Desktop ≥1024: layout unchanged (sidebar + chat fills viewport minus header).
