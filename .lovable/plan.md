## Goal
Make the chat composer in `LearnChat` sit flush at the bottom of the screen, removing the empty gap currently below it.

## Cause
`src/components/learn/LearnChat.tsx` line 417 applies `pb-[calc(var(--bottom-nav-h)+0.5rem)]` to the composer wrapper. The parent `AppLayout` (`fillViewport` mode) already reserves `var(--bottom-nav-h)` of bottom padding for the global bottom nav, so the composer ends up double-padded — leaving ~72px of dead space below the input.

## Change
In `src/components/learn/LearnChat.tsx` (line 417), replace the composer wrapper padding:

- From: `pb-[calc(var(--bottom-nav-h)+0.5rem)]`
- To: `pb-2`

No other files affected. Header, transcript, and composer order remain unchanged — the flex column with `mt-auto` on the composer already anchors it to the bottom once the duplicate padding is removed.

## Verify
- `/learn/:threadId` on mobile (498×638) and desktop: composer border-top sits directly above the bottom nav with no gap.
- Keyboard open on mobile: composer still rides above the keyboard via existing `--app-vh` visual-viewport handler.
