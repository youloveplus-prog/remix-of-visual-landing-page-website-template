## Make Space Grotesk the brand typography app-wide

The hero headline the user loves uses `font-grotesk` with `font-black` + tight tracking. Promote Space Grotesk to be the brand display font everywhere.

### Changes

1. **`src/main.tsx`** — add missing Space Grotesk weights for full coverage:
   - Add `500.css` and `800.css` (currently only 600/700 loaded; the hero uses `font-black` = 900 which silently falls back).
   - Keep Inter for body text (best for long-form readability).

2. **`tailwind.config.ts`** — update `fontFamily`:
   - `display` → `['Space Grotesk', 'Hind Siliguri', ...]`
   - Add `grotesk` → `['Space Grotesk', 'Hind Siliguri', ...]` (so existing `font-grotesk` utility resolves to the proper stack instead of relying on a CSS-var only definition).
   - Keep `sans` = Inter for body.

3. **`src/index.css`**:
   - `--font-display: 'Space Grotesk', 'Hind Siliguri', ui-sans-serif, system-ui, sans-serif;`
   - Keep `--font-sans` (Inter) unchanged for body.
   - This automatically restyles every `h1–h6`, `.display-headline`, `.font-display`, `.prose-legal h2`, and existing `font-grotesk` consumers without touching individual components.

### Out of scope

- Body text stays Inter (intentionally — pairing Space Grotesk display with Inter body is industry standard and what the hero already does).
- No component edits needed — the change is global via CSS variable + Tailwind config.
- Bangla stack (Hind Siliguri / Noto Sans Bengali) preserved as fallbacks.

### Memory

Update project memory: brand display font is now Space Grotesk, body remains Inter.