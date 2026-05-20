## Slim the Home page; move trust/promo content to landing pages

### Home page (`src/pages/Index.tsx`) — new priority order
Signed-in users see only quick-utility blocks, fastest to reach:
1. `GreetingStrip`
2. `HeroCarousel` (kept compact, no trust ribbon)
3. `TodayMissionCard`
4. **Quick Access carousel** (upgraded — see below)
5. `ContinueLearningRow`
6. `ProgressSnapshot` + XP
7. `AiAssistantBox`
8. Trending products (1 row)
9. New arrivals (1 row)
10. One community post
11. Slim "Learn more about ASIKON →" link to `/about`

Signed-out users see: HeroCarousel → Trending → New arrivals → 1 community post → slim About CTA.

### Sections moved OFF Home → onto About (`src/pages/About.tsx`)
These already exist as components and currently render on Home — they will be removed from Home and appended to About:
- `WhyTrust`, `HowItWorks`, `Testimonials`, `Faq`, full `FinalCta`, hero trust ribbon.

`useHomeSections.ts` FALLBACK will mark these `enabled_on_home = false` so admin can still toggle them back on via DB if desired.

### Quick Access carousel upgrade (`QuickAccessGrid.tsx`)
- Keep current 2-row embla carousel + modern gradient iOS-style icon tiles.
- Add more destinations so it covers every page NOT in the bottom nav:
  Continue, AI Tutor, Planner, Progress, Mentors, Prompts, Wishlist, Cart, Orders, Tracks, Lessons, Games, Messages, Notifications, Create, About, Settings, **Shop**, **Community**, **Profile**, **Help/Support**.
- Free-scroll snap on mobile (no arrows); responsive grid on desktop.
- 74-76px glass cards with `active:scale-[0.94]`, gradient chip per tile.

### Files touched
- `src/pages/Index.tsx` — reorder + remove trust/promo sections
- `src/pages/About.tsx` — append moved sections (WhyTrust, HowItWorks, Testimonials, Faq, full FinalCta)
- `src/hooks/useHomeSections.ts` — FALLBACK disables moved keys on home
- `src/components/home/workspace/QuickAccessGrid.tsx` — add extra tiles

### Out of scope
- Backend/schema, copy rewrites, redesign of existing cards, admin UI changes.

### Question
You mentioned "4 landing/promo pages". Confirmed earlier as **About** only. If you also want trust/promo copies on Shop, Mentors, Prompts, or another page, tell me which sections go where and I'll extend the plan.
