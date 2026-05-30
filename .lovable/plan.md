## Plan: Eduvora-style hero on Welcome + Index

Replace the current hero on both the public Welcome page (`/welcome`) and the authenticated Index home (`/`) with a new section modeled on the attached reference, plus a scrolling brand/partner strip directly beneath it. Keep brand tokens (dark red gradient, Space Grotesk display, Inter body) — do NOT use the orange from the reference.

### New component
Create `src/components/home/EduvoraHero.tsx`:
- Rounded-3xl card (`rounded-3xl`) with `bg-gradient-primary` (dark red), inner padding, generous radius like the reference.
- Two-column on `lg+`, stacked on mobile.
- Left column:
  - Stencil-feel display headline ("Master AI with practical **skills**") in `font-display font-black uppercase tracking-tight`, with the last word inside a bordered outline box (`border-2 border-primary-foreground/80 px-3 py-1`).
  - Sub-paragraph in `text-primary-foreground/80`.
  - Pill CTA: black circular arrow button + adjoining black pill "START LEARNING" → links to `/auth` (Welcome) or `/shop` (Index).
  - Bottom row: avatar cluster + "460+ learners trained" pill, and a circular play button (opens nothing on first pass — purely visual / could route to `/about`).
- Right column: existing course image (`@/assets/course-ai-ml.webp`) inside a soft rounded frame, with subtle glow/shadow. No new asset generation.
- Floating stat cards row (3 mini cards) overlapping the bottom-right: "98% success rate", "100+ trusted partners" (dark variant), "20+ active courses". Built with `bg-card`, `bg-foreground text-background` for the middle one.
- Fully responsive: stat cards collapse into a 3-col grid below image on mobile; headline scales down; padding shrinks.

### New partner strip
Create `src/components/home/PartnerMarquee.tsx`:
- Horizontal auto-scrolling marquee (CSS `@keyframes` translateX) of partner wordmarks: Spotify, Coinbase, Slack, Dropbox, Webflow, Zoom, Notion, Figma — rendered as styled text (`font-display font-bold text-2xl text-muted-foreground`) with small inline lucide icons where natural (e.g., `Slack` icon). Duplicated track for seamless loop. Pauses on hover. Lives in a `bg-secondary/40 border-y` band sitting flush under the hero card.

### Wiring
- `src/pages/Welcome.tsx`: replace the current Hero `<section>` block (the gradient bg + headline + dashboard preview card) with `<EduvoraHero variant="marketing" />` followed by `<PartnerMarquee />`. Remove the existing `partners` strip section (now redundant). Keep nav, features, why, steps, stories, CTA, footer untouched.
- `src/pages/Index.tsx`: on the mobile section, insert `<EduvoraHero variant="app" />` + `<PartnerMarquee />` at the very top (above `FlexiTopSection`). On desktop section, insert above `DesktopHeroBento`. Variant only changes CTA target + copy emphasis.

### Design tokens
- All colors via semantic tokens: `bg-gradient-primary`, `text-primary-foreground`, `bg-card`, `bg-foreground`, `text-background`, `border-primary-foreground/20`. No hardcoded hex.
- Use existing `--gradient-primary` from index.css (dark red) — do NOT introduce orange.

### Files
- create `src/components/home/EduvoraHero.tsx`
- create `src/components/home/PartnerMarquee.tsx`
- edit `src/pages/Welcome.tsx` (swap hero, drop old partner strip)
- edit `src/pages/Index.tsx` (mount on both mobile + desktop branches)
- edit `src/index.css` (add `@keyframes marquee` + `.animate-marquee` utility)

### Out of scope
- No new image generation (reusing `course-ai-ml.webp`).
- No changes to auth, data, routing, or sections below the hero.
