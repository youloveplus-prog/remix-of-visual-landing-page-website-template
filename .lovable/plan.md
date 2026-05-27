
# ASIKON — Apple-Quality Platform-Wide UI/UX Redesign

A staged plan to elevate the entire app to a calm, premium, Apple-grade learning platform — without breaking functionality, structure, or existing routes.

## Strategic framing

You've defined a **brand pivot**:

- Indigo `#2836D9` primary + mint `#00C896` accent (current code already uses indigo near `#2A41E0`; the dark-red memory note is stale and will be retired).
- **Light-first** Apple aesthetic (`#F7F8FC` bg / `#FFFFFF` cards / `#0F172A` text). Current app defaults to dark mode — we'll flip the default and keep dark as a polished alternate.
- Bangla-ready typography: **Hind Siliguri** + **Noto Sans Bengali** for Bangla, **Inter** for English UI, **JetBrains Mono** for code.

This is a 6-phase plan. Phases are independently shippable so the app stays usable throughout.

---

## Phase 0 — Tokens, fonts, theme reset (foundation)

The cornerstone. Everything downstream inherits from this.

- Rewrite `src/index.css` `:root` and `.dark` with the new token set:
  - `--background 220 33% 98%` (#F7F8FC), `--card 0 0% 100%`, `--foreground 222 47% 11%` (#0F172A), `--muted-foreground 215 16% 47%` (#64748B).
  - `--primary 233 70% 50%` (#2836D9), `--accent 162 100% 39%` (#00C896).
  - Soften `--radius` to `12px` (Apple-like, not the current `0.875rem`).
  - Replace 7-tier shadow stack with 3 calm tiers: `--shadow-soft`, `--shadow-card`, `--shadow-overlay` — all low-opacity, large-blur, downward.
  - Remove `--gradient-aurora` and overuse of brand gradients; keep one restrained `--gradient-primary` for hero accents only.
  - Tone down `.glass` blur from 32–48px to 18–24px; reduce border opacity; remove the rainbow inner sheen.
- Add self-hosted Bangla fonts via `@fontsource/hind-siliguri` and `@fontsource/noto-sans-bengali` in `main.tsx`.
- Tailwind `fontFamily`: `sans: ['Inter', 'Hind Siliguri', ...]`, `bangla: ['Hind Siliguri', 'Noto Sans Bengali', ...]`, `display: ['Inter', ...]` (retire Space Grotesk for body — keep for one or two hero moments).
- Set `:lang(bn)` to use the Bangla stack automatically.
- Flip `App.tsx` default theme from `dark` to `light` (keep system + manual toggle).
- Apple-style type scale via Tailwind `theme.extend.fontSize`: `display-xl 56/60`, `display 40/44`, `h1 32/36`, `h2 24/28`, `h3 20/24`, `body 16/24`, `caption 13/18` — letter-spacing tuned per size.
- Standardize spacing rhythm: section vertical padding `py-16 sm:py-24 lg:py-32`, container max-width `1200px`, gutter `24px` mobile / `48px` desktop.

Out: hard-coded `text-amber-400`, `stroke-emerald-400`, ad-hoc `text-white`/`bg-black` get a project-wide audit pass and replaced with semantic tokens.

---

## Phase 1 — Core primitives

Lift every component the rest of the app depends on.

- **Button** (`src/components/ui/button.tsx`): three calm variants — `default` (filled indigo), `secondary` (white card + 1px border), `ghost` (text-only with subtle hover bg). Sizes `sm 36`, `md 44`, `lg 52` — all thumb-friendly. Remove gradient default; keep `gradient-primary` as an opt-in `cta` variant for the one primary CTA per screen.
- **Card**: `bg-card`, 1px `border-border/60`, `shadow-soft`, `rounded-2xl`, 24px padding. No glass by default — glass becomes an explicit `<GlassPanel>` used only for floating chrome (nav, sheets).
- **Input / Textarea**: 1px border, 12px radius, 44px min-height, focus ring uses `--ring` with 2px offset. Inline error pattern with helper text below.
- **Section header** (existing): retune to match new type scale — eyebrow caption, large display title, optional one-line subtitle.
- **EmptyState** (existing): keep API, swap visuals to flat illustration tile + calm CTA.
- **Skeleton**: shimmer slowed to 2s, opacity reduced (no flicker).
- **Tabs / NavigationMenu / Dropdown / Sheet / Dialog**: audit visuals; align radii, shadows, spacing.

---

## Phase 2 — Navigation & shell

- **Mobile bottom nav** (`MobileBottomNav`): pure white surface, 1px hairline top border (not glass blur), 5 items max, centered FAB for Create (existing). Active indicator = filled icon + 3px gradient dot under label.
- **Mobile top header**: shrink to 56px, remove trust strip on scroll, sticky shadow appears only after 8px scroll.
- **Desktop sidebar**: pivot to the shadcn Sidebar primitive (already in repo); collapsed `w-14` mini variant with icons; grouped `Learn / Shop / Community / Library`; active route gets a subtle indigo left bar + tinted bg (no gradient).
- **Search**: single global search palette (Cmd+K on desktop, sheet on mobile), 3-tab result strip (existing `useGlobalSearch` keeps working).
- **Breadcrumbs**: add on `ProductDetail`, `LessonDetail`, `ContentDetail`, all admin pages.

---

## Phase 3 — Home (the new dashboard)

Reframe Home as a **calm learning OS**, one primary focus per scroll-screen.

- **Hero panel** (logged-in): full-bleed white card with oversized greeting ("সুপ্রভাত, Asikur"), one-line motivation, and a single primary CTA: "Continue learning · Python Day 4". Streak + XP move into a small chip row, not headline elements.
- **Today's mission**: single edge-to-edge card, generous padding, single action.
- **Continue learning**: 3-up horizontal row, large covers, progress bar under each — no gradient overlays, no glass.
- **Quick access grid**: 4 calm tiles (Tutor, Shop, Community, Mentors) — flat surfaces, icon + label + one-line description.
- **Trust strip**: single thin row directly under hero (COD, Verified buyers, Made in BD) — not three competing badges.
- **Sections below**: alternate white / `#F7F8FC` bands, each with one SectionHeader + content. Drop the "How it works" + "FAQ" walls of text; keep one editorial section.
- Remove non-essentials (`StreakBadge`, decorative aurora bg, repeated category strips).
- First-time tour (already wired) — reduce to 3 steps, calmer copy.

Logged-out hero: full-bleed Apple-style headline ("Learn anything. With AI. In Bangla."), one CTA, one secondary link. No carousels.

---

## Phase 4 — Learn (AI tutor + tracks + lessons)

- **AI chat** (`LearnChat`): full-height column, generous side padding, message bubbles use `border` not `glass`. User messages indigo fill; assistant white card. Code blocks get JetBrains Mono + 1px tinted border. Streaming indicator: 3 fading dots. Suggested follow-ups as ghost chips. Copy/regenerate per assistant message.
- **Track / Course detail**: hero with cover, title, short description, "Start" primary CTA, lesson list below with progress ring per item. No floating cards stacked over images.
- **Lesson reading view**: 720px max content width, reading progress bar at top, large body type, "Next lesson" sticky footer (single button).
- **Prompts library**: clean grid of cards, copy-to-clipboard on tap, category filter chips at top.

---

## Phase 5 — Shop, Product, Cart, Checkout

- **Shop list**: white background, calm product cards (square cover, name, price, single trust badge). Remove badge stacks. Filter chips become a single sticky chip row + sheet for advanced filters.
- **ProductDetail**: split layout on desktop (image gallery left, details right). Mobile: image first, sticky bottom add-to-cart bar with price. Trust block (COD, returns, verified) directly under price. Reviews summary above the fold; full reviews below.
- **Cart / Checkout**: linear 3-step flow (Cart → Address → Confirm) with progress strip at top, single primary CTA at bottom of each step, sticky order summary on desktop.

---

## Phase 6 — Community, Mentorship, Profile finishing pass

- **Community**: feed cards become quieter (white, soft shadow), media-first, comment/like counts as text not pills.
- **Mentorship**: mentor cards adopt new Card primitive; CTA "Join waitlist" with social-proof count.
- **Profile** (already partially redone): apply the new tokens; replace remaining glass surfaces with cards; align type scale.
- **Settings / Auth / Notifications / Orders**: pure form polish — labels above inputs, generous spacing, single CTA per screen.
- **Empty / error / loading**: every list-view uses shared `EmptyState`, matching skeletons, branded fallback in `ErrorBoundary`.

---

## Phase 7 — Motion + a11y final pass

- Motion: keep only `fade-in`, `fade-in-up`, `scale-in` (220–280ms `cubic-bezier(0.22,1,0.36,1)`); remove all custom durations >360ms. Hover = 1% scale or shadow lift, never both. Reduced-motion respected (already partly in CSS).
- A11y: WCAG AA pass on new tokens (verified 4.5:1 on muted text); `axe` audit on Home/Shop/ProductDetail/Learn/Checkout/Profile; fix remaining icon-only buttons; ensure all dialogs/sheets trap focus (Radix does this for free).
- Performance: lazy-load below-the-fold sections (already in place for Home); preload LCP image; convert top imagery to AVIF/WebP via Supabase image transforms.

---

## What stays untouched

- Routes, URL structure, public component prop APIs.
- Business logic: auth, payments, coins, mentorship waitlist, AI tutor backend, search RPC.
- Data model, RLS, edge functions.
- The product brand statements (Mission & Vision component).

## Suggested execution order

The user approves a phase → I ship that phase → we screenshot-review → next phase.

1. Phase 0 (tokens / fonts / theme) — foundation, ~1 turn.
2. Phase 1 (primitives) — ~1 turn.
3. Phase 2 (navigation) — ~1 turn.
4. Phase 3 (Home) — ~1 turn.
5. Phase 4 (Learn) — ~1 turn.
6. Phase 5 (Shop/Product/Checkout) — ~1–2 turns.
7. Phase 6 (Community/Mentorship/Profile polish) — ~1 turn.
8. Phase 7 (motion + a11y) — ~1 turn.

Approve the plan and I'll start with **Phase 0**. If you'd rather I run multiple early phases back-to-back without checkpoints, say "Phase 0–2 in one go".
