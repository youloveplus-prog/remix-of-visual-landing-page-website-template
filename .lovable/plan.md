## Goal
Restyle the mobile header to match the Flexipay reference: soft sky-blue gradient background, circular white left button containing the Asikon logo, centered "ASIKON" wordmark, circular white notification bell on the right (with red dot).

## Scope
File: `src/components/layout/MobileHeader.tsx` only.

## Changes

1. **Background**: replace the current transparent/blurred-on-scroll bg with a fixed sky-blue gradient (`bg-gradient-to-b from-sky-200 via-sky-100 to-background`). Keep border/shadow off until scrolled (`scrolled` still triggers a subtle bottom border).
2. **Left button** (home route, not inner): circular white pill `w-10 h-10 rounded-full bg-white border border-border shadow-sm` containing the Asikon logo image `h-6 w-6`. Replaces the current "logo + text" inline button. Keeps `onMenuClick`.
3. **Center**: "ASIKON" wordmark — `font-display font-bold tracking-[0.25em] text-sm text-foreground`, absolutely centered.
4. **Right button**: circular white `w-10 h-10 rounded-full bg-white border border-border shadow-sm` with `Bell` icon and small red dot indicator. Links to `/profile` (notifications placeholder).
5. **Inner routes** (back state): keep existing back-button behavior; right side just shows the bell circle (no menu logo).
6. Remove unused `Search`, `ShoppingCart` imports and `onSearchClick`, `cartCount` props (mark optional + ignore) to avoid breaking call sites; safer: keep prop signature, just don't render those buttons.

## Out of scope
No changes to FlexiTopSection, AppLayout, or any other file.
