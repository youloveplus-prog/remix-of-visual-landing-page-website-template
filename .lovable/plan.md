## Cause
`BottomNav` is rendered outside the page by `PersistentMobileShell` in `src/App.tsx`. It has a `hideOn` list of routes where the nav is hidden (`/auth`, `/checkout`, `/lesson`, etc.). `/learn` is missing from that list, so the bottom nav still appears even though `Learn.tsx` no longer uses `AppLayout`.

## Fix
**`src/App.tsx`** — add `"/learn"` to the `hideOn` array in `PersistentMobileShell` so the bottom nav is not rendered on `/learn` or `/learn/:threadId`.

That's the only change. The Learn page already has its own standalone shell with its own slim top bar, so once the global bottom nav is suppressed it becomes a true full-screen page.
