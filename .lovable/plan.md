# App-wide audit, perf & code quality pass

Goal: every page loads, renders correctly, and the home route hits LCP < 2s on a mid-range mobile. No feature/UX changes — only quality, perf, and bug fixes uncovered during the sweep.

## What the audit found

```
src/assets               6.5 MB total
  coming-soon-course.png 1.9 MB
  coming-soon-book.png   1.4 MB
  coming-soon-teaching   1.1 MB
  asikon-tutor-avatar    336 KB
fonts                    5 families × 3-4 weights eager-loaded in main.tsx
                         (inter, space-grotesk, hind-siliguri,
                          noto-sans-bengali, jetbrains-mono)
vite.config.ts           no manualChunks, no compression, no imagetools
pages                    35 routes, all already lazy-loaded ✓
Index.tsx 430 / Welcome 461 / Game 326 — heavy, render-blocking on first paint
```

Biggest wins (in order): images, fonts, chunking, render budget.

## Plan

### 1. Image diet (biggest LCP win)
- Re-encode `coming-soon-course/book/teaching.png` (1-2 MB each → ~80-120 KB WebP). Same dimensions, lossy q80, transparent preserved.
- Re-encode `asikon-tutor-avatar.png` → WebP.
- Convert hero/tutor JPGs (`tutor-ssc/hsc/bsc`, `home-tutor`, `course-*`, `prompt-library`, `student-kit`) to WebP at 1280px max width, q78.
- Update imports to `.webp`. Keep PNG fallback only where transparency matters.
- Add explicit `width`/`height` on every `<img>` we touch in the home route to kill CLS.
- Ensure the LCP image on `/` has `fetchpriority="high"` and `loading="eager"`; everything below the fold stays `loading="lazy" decoding="async"`.

### 2. Font diet
- Drop weights actually unused (audit shows we only need: Inter 400/500/600/700, Space Grotesk 500/700, Hind Siliguri 400/600, Noto Bengali 400, JetBrains 400). Remove the rest from `main.tsx`.
- Add `font-display: swap` confirmation (fontsource ships it but verify).
- Preload the 2 critical files (Inter 400 + Space Grotesk 700) via `<link rel="preload" as="font" crossorigin>` in `index.html`.

### 3. Vite build config
- Add manual chunks: `react`, `radix` (all `@radix-ui/*`), `supabase`, `charts` (recharts), `markdown` (react-markdown + remark + streamdown). Keeps each page's lazy chunk small.
- Enable `build.cssMinify: 'lightningcss'` + `build.minify: 'esbuild'` (default but explicit).
- Add `vite-imagetools` so future imports can use `?format=webp&w=…` directly.
- `reportCompressedSize: false` to speed CI builds (cosmetic).

### 4. Render budget on `/`
- Audit `Index.tsx` (430 lines): defer everything below the first viewport (`ComingSoonTrio`, `MasterpieceShowcase`, `MentorshipHomeSection`, `BrandStrip`, `restSections`) behind a single `IntersectionObserver`-gated `Suspense` so the initial JS for the home route shrinks.
- Hero slider (`ImageHeroSlider`): preload only slide 1's image; the others stay lazy. Confirm autoplay does not force-load all slides.
- Memoize chip arrays and section render context (already partially done — finish the pass).

### 5. Data fetching
- `useProducts({ limit: 20 })` + `useFeaturedProducts(10)` + `useHomeSections` fire in parallel on `/` — confirm they share React Query cache keys and have sensible `staleTime` (5 min) so back-nav is instant.
- Add `placeholderData: keepPreviousData` where lists paginate.
- Verify Supabase preconnect (already in `index.html`) is still pointing at the right ref.

### 6. Smoke test every route
Walk all 35 routes in the preview, fix anything that throws or renders blank. Routes to hit:
`/`, `/auth`, `/welcome`, `/shop`, `/product/:slug` (one), `/cart`, `/checkout`, `/orders`, `/orders/:id`, `/wishlist`, `/learn`, `/lesson/:id`, `/track/:slug`, `/library`, `/courses`, `/digital`, `/services`, `/prompts`, `/mentors`, `/community`, `/content/:id`, `/create`, `/game`, `/leaderboard`, `/notifications`, `/profile`, `/settings`, `/about`, `/contact`, `/help`, `/terms`, `/privacy`, `/refund`, `/reset-password`, `/admin/*` (overview only — admin is gated).

For each: console error check, network 4xx/5xx check, visual smoke. Fix-on-sight: missing keys, broken images, unused imports, dead code.

### 7. Code quality sweep
- Run TS check; fix any new errors introduced.
- Remove unused exports/files surfaced during the sweep (no speculative deletion).
- Replace `any` with concrete types in files I have to touch anyway.
- Ensure every list uses stable `key`s.

## Verification

- `npm run build` succeeds; report new bundle sizes vs. before.
- `browser--performance_profile` on `/` after deploy: target LCP < 2000 ms, INP < 200 ms, CLS < 0.05.
- No new console errors on any of the 35 smoke-tested routes.

## Out of scope

- No new features, copy changes, redesigns, or DB migrations.
- No removal of Print-on-Demand (already gone) or Mentorship.
- No auth/RLS changes.

## Technical notes

- WebP conversion uses `nix run nixpkgs#libwebp -- cwebp` inside the sandbox; PNG alpha preserved with `-q 80 -alpha_q 90`.
- JPG → WebP via `cwebp -q 78`.
- Image references updated only where the file is imported; no broad find-replace.
- Manual chunks defined as a function returning the chunk name based on module id, so new radix packages auto-bucket.
