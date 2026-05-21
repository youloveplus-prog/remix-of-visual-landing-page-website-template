
## Goals

1. **Home — use brand primary color everywhere.** Today the homepage mixes amber, sky, and other accent colors on tiles, icons, and badges. Re-tint every home item to the brand dark-red gradient / primary token system so the page reads as one identity.
2. **Hero slider — redesign.** Current slider is a plain image with a black bottom gradient and a white CTA pill. Rebuild it in the brand's liquid-glass + dark-red gradient language with stronger hierarchy and meaningful motion.
3. **AI page composer — never under the bottom nav.** The pinned chat box can slip behind the nav on some viewports. Make it always sit flush above the nav bar.

---

## 1. Homepage primary-color sweep

Files: `src/pages/Index.tsx`, `src/components/home/sections/*`, `src/components/home/workspace/*`

Audit and replace non-brand colors with brand tokens:
- `quick_actions` second tile: `from-amber-400/30 to-amber-500/10`, `text-amber-400`, `border-amber-400/20` → primary-tinted glass (`gradient-primary-soft`, `text-primary`, `border-primary/20`).
- `quick_categories` color classes (`from-accent/20`, mixed primary/accent) → unified `gradient-primary-soft` variants with `text-primary` icons.
- Sweep `src/components/home/workspace/*` (GreetingStrip, QuickAccessGrid, ProgressSnapshot, ContinueLearningRow, AiAssistantBox, ActivityFeed, UpcomingCard, InsightCard) and `src/components/home/sections/*` (HowItWorks, WhyTrust, Testimonials, Faq, FinalCta) and `TodayMissionCard` for any hardcoded amber/sky/emerald/violet/rose colors on icons, badges, or backgrounds; replace with `primary`, `primary/10`, `primary/20`, `gradient-primary`, `gradient-primary-soft`, `shadow-glow`.
- Keep semantic non-brand uses: success ticks, warnings, destructive states, verified badges. Do not recolor those.
- No raw hex / `text-white` / `bg-black` introduced.

## 2. Hero slider redesign

File: `src/components/carousels/HeroCarousel.tsx`

New direction (brand-aligned, single visual language):
- Container: `rounded-3xl`, 1px brand gradient border, soft outer glow `0_20px_60px_-20px_hsl(var(--primary)/0.45)`.
- Slide aspect: `aspect-[5/4]` mobile, `aspect-[16/9]` tablet, `aspect-[21/9]` desktop (kept).
- Image: full-cover with a slow 6s `scale-105 → scale-100` Ken-Burns drift while active; pauses with carousel pause.
- Overlay: replace flat black gradient with a layered scrim — bottom 60% uses `linear-gradient(to top, hsl(var(--background)/0.95), hsl(var(--background)/0.4), transparent)` plus a low-opacity brand-red gradient wash from the bottom-left corner for warmth.
- Eyebrow chip above the title: small glass pill with a 1.5px primary dot + slide category text (e.g. "New course", "Library", "Deals"). Derived from a new optional `eyebrow` field on `HeroSlide`; fall back to slide index label if not provided.
- Title: `font-display` (Space Grotesk), tighter tracking, gradient text using `text-gradient` utility on the first word/phrase for emphasis.
- Subtitle: `text-foreground/80`, 2-line clamp.
- CTA: replace white pill with brand `gradient-primary` pill, primary-foreground text, `ArrowUpRight`, micro-shimmer on hover, `active:scale-95`.
- Secondary action (optional, desktop only): ghost "Learn more" link.
- Arrows: bigger hit area (40px), glass background, brand-tinted border, fade in on container hover only.
- Dots → progress segments: 3 thin horizontal bars at bottom; the active one animates a fill (left→right) over `autoplayDelay` ms to telegraph time-until-next-slide. Inactive bars are dimmed. Click still jumps to slide.
- Slide transition: keep embla default; add a 250ms cross-fade of the text block via `animate-fade-in` keyed on `selectedIndex`.
- Pause-on-hover (kept) + pause-when-tab-hidden via `document.visibilitychange`.
- Accessibility: `aria-roledescription="carousel"`, per-slide `aria-label`, progress bars have `aria-label="Go to slide N"`, autoplay respects `prefers-reduced-motion` (no Ken Burns, no progress animation — static dots).

`HeroSlide` type extension (additive, backward compatible):
```ts
interface HeroSlide {
  id: string; image: string; title: string; subtitle?: string;
  eyebrow?: string;           // new
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string }; // new, desktop only
}
```

Update the three slides in `Index.tsx` with eyebrows: "New course", "Prompt Library", "Limited deal".

## 3. AI composer above the bottom nav

Files: `src/components/learn/LearnChat.tsx`, possibly `src/components/layout/AppLayout.tsx`

Diagnosis: `Learn.tsx` wraps content in `<div className="flex h-full">`. The main container in `AppLayout` uses `h-[100dvh]` + `paddingBottom: var(--bottom-nav-h)`. On some mobile browsers (URL bar collapse, iOS Safari) `100dvh` recomputes and the inner flex column's `h-full` momentarily exceeds the padded box, letting the composer (the last `shrink-0` child) clip behind the fixed nav.

Fix: anchor the composer with `position: sticky; bottom: 0` inside the scroll/flex column **and** ensure the composer's container has `pb-[env(safe-area-inset-bottom)]` so iOS home-indicator zone is respected on top of the nav offset. Concretely:
- Wrap the composer area in a `sticky bottom-0` element with `z-20` and `bg-background/85 backdrop-blur-xl` so it always rides the bottom edge of the visible chat area, never beneath the nav.
- Add `pb-[env(safe-area-inset-bottom)]` to the composer wrapper (in addition to existing padding) as a belt-and-braces measure.
- In `Learn.tsx`, change the outer wrapper from `flex h-full` to `flex h-full min-h-0` and ensure the right column has `min-h-0` (already true in `LearnChat` root, but the parent `<div className="flex-1 flex flex-col min-w-0 min-h-0">` needs to be the direct child — verify).
- Verify the scroll/transcript area still scrolls behind the sticky composer (it should — sticky doesn't take it out of flow).

No backend or routing changes.

## Out of scope
- No new home sections, no admin section toggles
- No AI tutor logic changes
- No hero slide content changes beyond adding eyebrow labels

## Acceptance
- Homepage: zero amber/sky/violet/rose icons or backgrounds remain on the home route (status/semantic colors excepted).
- Hero: brand gradient border + glow, eyebrow chip, gradient title accent, animated progress segments, Ken Burns on the active slide (motion-safe).
- AI page on a 393×701 viewport: composer sits flush against the bottom nav at all times — confirm by scrolling messages, opening/closing the keyboard simulation, and switching threads.
