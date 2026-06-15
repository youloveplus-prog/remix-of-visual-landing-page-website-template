# Header scroll behavior + mega menu fix

## Problems
1. When the mega menu panel is open and the user scrolls even a few pixels, the header row's `padding` transitions from `py-2.5` → `py-1.5`. This resizes the row mid-frame, Radix recomputes the panel position, and the pointer falls outside the trigger → the panel auto-closes.
2. The header is always pinned, which the user finds heavy. They want it to slide away while scrolling down and slide back in on scroll-up — like a typical app bar.

## Fix

### 1. `src/hooks/use-scroll-direction.ts`
Expose a stable `direction` that only flips after the user moves more than the threshold in one direction (already mostly there). Add a small "near top" guard so the header always shows in the first ~80px of the page even when scrolling down.

### 2. New hook: `src/hooks/use-header-visibility.ts`
Combines `useScrollDirection` with mega-menu "open" awareness:
- Returns `hidden: boolean`.
- `hidden = true` when `direction === 'down' && scrollY > 80 && !isMenuOpen`.
- `hidden = false` otherwise (scroll-up, near top, or any panel open).
- Exposes a tiny context (`HeaderMenuOpenContext`) that `MegaMenu` writes into via Radix `NavigationMenu`'s `onValueChange` (empty string = closed, non-empty = open). This way the header never hides — and never resizes — while a panel is open, killing the auto-close bug.

### 3. `src/components/layout/DesktopHeader.tsx` and `SlimDesktopHeader.tsx`
- Wrap both with `HeaderMenuOpenProvider`.
- Apply a `transform: translateY(-100%)` slide when `hidden` is true, with `transition-transform duration-300 ease-out`.
- **Remove the `py-*` padding transition** on the primary row. The row keeps a single, stable padding (`py-2`), so the mega-menu trigger never shifts mid-hover. The "compact" feel comes from the slim brand (`HeaderBrand compact`) which we now drive off `scrollY > 80` instead of toggling row padding.
- Keep the breadcrumb sub-row collapse on scroll (that row is below the menu and doesn't affect trigger position).
- Keep `isolate overflow-visible` so the panel is never clipped.

### 4. `src/components/layout/MegaMenu.tsx`
- Convert the Radix root to controlled mode: `value` + `onValueChange` wired to the `HeaderMenuOpenContext`. This both (a) lets the header know a panel is open so it won't hide, and (b) ensures the panel doesn't get torn down by an accidental re-mount during scroll.

### 5. `src/components/layout/HomeTopHeader.tsx`
Same translate-on-hidden treatment so behavior is consistent across all desktop headers.

## Out of scope
- Mobile header (request is desktop-only).
- Visual restyle of the panel itself.
- Any business logic / data changes.

## Verification
- Build passes.
- Playwright: load `/shop`, hover Learn → panel opens, scroll 400px down → header slides up, panel closes cleanly; scroll up 1px → header slides back; hover Learn again → panel reopens reliably. Screenshot each step.
