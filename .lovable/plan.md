# UI/UX Audit & Redesign Plan — ASIKON

Benchmarks: **Coursera / Brilliant / MasterClass** (learning), **Apple / Aesop / Linear** (premium editorial commerce), **Instagram / Threads / Discord** (social). Audited at **390px** and **1440px** across Home, Shop, Community, Learn, Mentors, About, Auth, Cart, Profile.

---

## Part 1 — Audit findings (by severity)

### CRITICAL — breaks first-impression / global standards

1. **Home hero has a giant empty void (mobile + desktop).** Headline "Learning, re-imagined." sits at top, then ~600px of nothing before the partner marquee. Premium sites (Apple, Linear) never leave hero unanchored — they pair the headline with an immediate visual proof (product render, motion, supporting metric). Right now the page feels broken-loaded.
2. **Product card thumbnails are solid dark-brown placeholders across Shop, Bundles, and Featured.** Every card on `/shop` shows the same brown square. No commerce site at any tier ships without product imagery — this single issue makes the shop feel non-functional. Either real images aren't loading, or the fallback is a flat color instead of a styled placeholder with the product name/category glyph.
3. **Community feed shows only skeleton loaders** at the visible viewport on both mobile and desktop — the page reads as "loading forever." Skeletons should resolve in <800ms or fall back to a curated empty state with seed posts. The right-rail "Live now" + "Trending tags" on desktop is good; the empty center column undermines it.
4. **Hero typography on desktop is washed out.** "re-imagined." renders in pale lavender on cream, failing AA contrast and visually disappearing. The mobile version uses saturated blue and works — desktop diverged.
5. **Headline tracking is too tight / letters touching.** "Your AI tutor, 24/7", "The course we'd start with today.", "Bundles & collections" — Clash Display with negative tracking is collapsing spaces between words on mobile. This reads as a bug, not a style choice.

### HIGH — clearly behind global standard

6. **Bottom nav active dot indicator is a tiny blue underline on a chip-less bar.** Instagram/Threads use a filled glyph swap; Linear/Arc use a pill background. Current state is hard to read at a glance.
7. **Header logo lockup is unbalanced.** A small triangle glyph + "Asikon" wordmark in two different weights/colors looks like a placeholder. Either commit to a single mark (wordmark only) or design a proper lockup with consistent baseline.
8. **Filter chips on Shop overflow off-screen on mobile** with no scroll affordance (no fade, no arrow). User can't tell "Student Kits, Prompt Library, AI Tutor, Gadgets" exists.
9. **Profile cover gradient is a generic purple→indigo blur** — clashes with the cream brand theme and looks AI-default. Brand uses indigo `#3b4fe0` + warm cream; cover should follow.
10. **Profile has two competing tab rows** stacked (Posts/Media/Reviews/… then POSTS/FOLLOWERS/FOLLOWING). Pick one IA — Instagram-style segment OR sub-tabs, not both.
11. **Cart empty state is a full-page blank with one button** — wastes the whole viewport. Coursera/Amazon use empty cart to merchandise (recently viewed, recommended bundles).
12. **Desktop sidebar is visually heavy** — 240px of dim cream with all-caps section labels ("MENU", "LIBRARY", "ACCOUNT") feels like a 2014 admin panel. Modern learning platforms (Brilliant, Khan) use a slim icon rail that expands on hover, or top-nav only.
13. **Trust strip (Instant access / Secure checkout / Verified buyers / 7-day money-back)** is rendered as 4 equal pill cards on mobile = visual noise. Premium pattern: single thin horizontal strip with icons and dividers, or a single rotating line.
14. **Mobile "Featured this week" / "Bundles & collections" headlines are oversized + saturated blue,** competing with hero. Section headers should be quieter than the hero (smaller scale, neutral color, eyebrow above).

### MEDIUM

15. Hero eyebrow chip "BUILT IN BANGLA & ENGLISH" uses Departure Mono inside a pill — mono in a pill reads as code badge, not editorial eyebrow.
16. Card price treatment: `৳3,538 ৳9,638` with strikethrough is fine, but the `-63%` badge is solid blue on a dark image — move to a refined chip or surface as savings copy ("Save ৳6,100").
17. Heart/wishlist icon is on a flat cream circle that disappears on dark cards — needs a glass/elevated treatment.
18. CTA button styling is inconsistent: "Get", "Read", "Get access", "Read now" with arrow icons + brackets `↗ Get ↗` is visually cluttered. Pick one CTA pattern.
19. "11 learning resources found" count line is dropped between filter chips and section header — orphan text, no hierarchy.
20. Learn page "Pick your track" shows 5 empty cream rectangles (skeleton or empty?). If skeleton, fix load; if empty state, design copy + illustration.
21. Quick Actions grid on Learn (Prompt library / Revision / Courses / AI tutor) is a 2x2 of identical cards — opportunity for a bento with varied tile sizes/icons.
22. Footer is not visible on any audited page — confirm whether the app intentionally has no footer (mobile-app-style) or footer is missing.
23. Mobile section vertical rhythm is tight after recent edits, but headline → body spacing on hero is still too loose (subhead floats 300px above next section).
24. Search bar on desktop header is full-width with placeholder "Search courses, products, mentors, services…" — too many entities listed; modern pattern is "Search ASIKON" with autosuggest by type.

### LOW / polish

25. Notification bell badge "2" uses a saturated red on a cream header — clashes with brand indigo.
26. Story rail (My Feed) borders are pure blue at 2px — Instagram uses a gradient ring with subtle width.
27. Profile completion bar uses square checkboxes inside chips — pick one container (chip OR checkbox row).
28. Level/XP card "Lv.1  0 XP total  100 to Lv. 2" is a flat bar — gamified products animate the fill and add a tier emblem.

---

## Part 2 — Redesign directions for weakest sections

After you approve this audit, I will generate **3 rendered design directions** (locked to the brand palette + Clash Display / Schibsted Grotesk / Departure Mono) for each of these three highest-leverage areas, presented as clickable prototypes:

1. **Home hero + trust strip** — kill the void; bind headline to a hero artifact + refined trust line.
2. **Shop product card + grid** — solve the missing-image problem with a styled fallback system, refine price/badge/CTA hierarchy, fix chip overflow.
3. **Community feed shell (mobile + desktop)** — story rail, post card, right-rail composition; replace skeleton-forever with a confident first paint.

You pick one direction per area, I implement it pixel-for-pixel against the chosen prototype.

---

## Part 3 — Implementation order (after directions approved)

1. Brand foundation pass: header lockup, bottom nav active state, trust strip, button/CTA system, badge system. (~touches 6–8 shared components)
2. Home hero rebuild from chosen direction.
3. Shop card + grid + filter chips + image fallback.
4. Community feed shell + empty/loading states.
5. Profile cover + tab consolidation + completion card refresh.
6. Cart empty state with merchandising.
7. Desktop sidebar slim/expand pattern.
8. Learn page bento + Quick Actions variation.
9. Typography micro-pass (tracking on Clash Display, eyebrow chip restyle).

---

## Technical notes

- All color/spacing/radius changes go through tokens in `src/index.css` and `tailwind.config.ts` — no hardcoded utilities.
- Existing memory rules respected: indigo `#3b4fe0`, cream `#faf6ef`, Clash Display headings, Schibsted Grotesk body, rounded bento (radius 20px).
- Product image fallback will be a deterministic gradient + glyph component (no external generation per card) to keep bundle size flat.
- Skeleton-to-content threshold for Community feed needs investigation — may be a query issue, not just visual.
- No backend/business-logic changes in Parts 2 & 3 unless we discover the Community/Shop empty data is a data-fetch bug; if so I'll surface separately.

After you approve, I'll start by generating the 3 design directions for the Home hero so you can pick one.