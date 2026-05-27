## Make Community tab bar sticky on mobile scroll

### Problem
The Community page tab bar (`My Feed | Posts | Videos | Shorts | Reviews | Offers`) is passed to `MobilePage` via its `sticky` prop, and `MobilePage` already wraps it in a `sticky` container. However, the wrapper uses `top-0`, which causes the tab bar to try to stick at the very top of the viewport — directly underneath the fixed mobile header (`z-40`). The tab bar itself is `z-30`, so it remains hidden behind the header when it attempts to stick.

### Fix
Change the sticky offset in `src/components/layout/MobilePage.tsx` from `top-0` to `top-[var(--app-header-h)]` so the tab bar sticks flush below the measured mobile header height instead of overlapping it.

### Scope
- Single file edit: `src/components/layout/MobilePage.tsx`
- No other layout or component changes needed — the `CommunityTabs` already supports `bg-background/85 backdrop-blur-md` and `border-b` for a clean sticky strip appearance.