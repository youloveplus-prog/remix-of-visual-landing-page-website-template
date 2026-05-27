## Home Page UI Enhancement — Midnight Indigo Bento

Apply the selected "Kinetic Glow" direction to the mobile home. Keep all current sections and data; refine visuals only.

### Design tokens (locked)
- Palette: `#0a0a1a` bg, `#141432` surface, `#1e1e5a` raised, `#4f46e5` accent.
- Type: Space Grotesk **Bold/700** for display headings; Inter for body. Add a `font-display` utility.
- Vibe: deep navy void + ambient indigo glow (blurred radial blobs), thin white/5 borders, generous rounded-3xl tiles.

### Files to edit
1. `src/index.css` + `tailwind.config.ts` — add Midnight Indigo HSL tokens (`--surface`, `--surface-raised`, `--accent-indigo`, `--glow`), `font-display` family, `bg-glow` radial helper. Keep existing dark-red brand tokens intact for other pages; introduce a `.home-midnight` scope only if needed to avoid bleed.
2. `src/pages/Index.tsx` — wrap mobile render in a `min-h-screen bg-[hsl(var(--surface-bg))] text-foreground` shell; restructure section order to the bento flow: hero → quick-actions chip row → AI Tutor + Streak (2-col) → Books + Prompts (2-col) → Mentorship (full-width) → Trending Now carousel.
3. `src/components/home/mobile/ImageHeroSlider.tsx` — restyle slide: rounded-3xl, `#141432` surface, top-left "NEW COURSE" pill (indigo-tinted), Space Grotesk 3xl headline, ambient indigo blur blob top-right, arrow CTA bottom-right.
4. `src/pages/Index.tsx` `quick_actions` renderer — replace 2-tile block with:
   - Horizontal scroll chip row (Continue / AI Tutor / Planner) using `#1e1e5a/30` pills.
   - Below: 2-col bento with **AI Tutor** tile (indigo icon, "Active 24/7" microcopy) and **Streak** tile (indigo-600/10 bg, indigo-500/20 border, glow blur, "12 Days / +30 XP Today").
5. `quickCategories` block — render as 2×2 bento of large rounded-2xl `#141432` tiles with icon + label (Courses, Books, Prompts, Trending).
6. `src/components/mentorship/MentorshipHomeSection.tsx` — restyle the wrapper card to match: `#1e1e5a` bg, indigo radial blur top-right, white CTA button with `text-[#0a0a1a]`.
7. Trending Now header — Space Grotesk uppercase tracking-wider, "View All" link in indigo-400.
8. `ProductCard` (only when rendered inside home trending row) — let existing component stand but ensure parent gives it a `#141432` surface + indigo accent badge. If it clashes, add a `variant="midnight"` prop scoped to home.

### Motion
- Add `animate-fade-in` stagger on tile mount (delay-75/150/225 via Tailwind).
- Hover: tile gets `ring-1 ring-indigo-500/40 shadow-[0_0_30px_rgba(79,70,229,0.25)]` via `transition-all`.
- Hero CTA circle: on group-hover swap bg to indigo-600.

### Out of scope
- Desktop home (keep as-is unless trivially compatible).
- Other pages' branding (still dark-red).
- Data layer, routing, business logic.

### Acceptance
- Mobile preview at 498px matches the Kinetic Glow prototype: dark navy bg, indigo glows, Space Grotesk bold headlines, bento tile rhythm, white-text mentorship CTA.
- No regressions on signed-in vs signed-out flows; all existing sections still present.
