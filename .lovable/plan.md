Create a new `ResponsiveDebugOverlay` component in `src/components/dev/` (next to the existing `StickyLayoutDebugger`). Mount it inside `AppLayout.tsx` so it renders on every page.

The overlay displays in a small fixed pill at the top-right corner (z-50, dev-only, `pointer-events-none`):
- Current viewport width in px
- Current breakpoint label: `mobile` (< 768px), `tablet` (768–127.3px), or `desktop` (≥ 1024px)
- Active layout branch: `mobile-header`, `home-megamenu`, or `slim-header+sidebar`
- Sidebar state: `collapsed` / `expanded` / `n/a`
- Color-codes the branch label for quick scanning (e.g. blue for megamenu, amber for slim header, gray for mobile)

It uses `useIsMobile()`, `useLocation()`, `useSidebarState()`, and a `ResizeObserver`/`window resize` listener for live width updates. The component returns `null` when `!import.meta.env.DEV` so it is completely stripped from production builds, matching the existing debugger pattern.