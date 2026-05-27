# Composer safe-area + bottom-nav fix

## Problem
On mobile, the chat composer (`/learn`) sits flush with the bottom of the `fixed inset-0` shell — but the global `BottomNav` (`fixed bottom-0 h-[var(--bottom-nav-h)]`, also `z-50`) renders over the lower portion of the screen. Result: the composer is partially or fully hidden behind the bottom tab bar.

## Fix
Bump the composer's bottom padding to clear both the device safe-area inset AND the bottom-nav height. The `--bottom-nav-h` token already collapses to `0px` at `lg` breakpoint, so desktop is unaffected.

### Change
`src/components/learn/LearnChat.tsx` — composer wrapper:

```diff
- className="shrink-0 mt-auto px-3 sm:px-6 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] border-t border-border bg-background/95 backdrop-blur-xl"
+ className="shrink-0 mt-auto px-3 sm:px-6 pt-2 pb-[calc(var(--bottom-nav-h)+0.5rem)] border-t border-border bg-background/95 backdrop-blur-xl"
```

`--bottom-nav-h` already includes `env(safe-area-inset-bottom)` in its definition (`calc(72px + env(safe-area-inset-bottom, 0px))`), so this single value covers both the nav height and the home-indicator safe area on iOS.

## Out of scope
- No changes to `BottomNav`, layout shell, header, or transcript styling.
- No z-index changes.
