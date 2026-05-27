## About page polish: typography, copy, responsive layout

### Typography
- Hero h1: clamp(2.4rem, 7vw, 5.5rem), tracking-tighter, max 2 lines desktop.
- Section headings unified on display-2, tighter leading, font-display.
- Eyebrows: 11px, 0.22em tracking, uppercase, accent color.
- Body: 15px mobile / 16px desktop, leading 1.65, muted.
- Stats: tabular-nums, gradient only on the number.
- Prose max-w 52ch; display headings max-w ~18ch.

### Copy (cut ~40%, no em-dashes, complete sentences)
Rewrites with periods/commas instead of "—":
- Hero sub: "AI-powered learning, built for Bangladesh. One small lesson a day."
- Calm classroom: "Every lesson takes a few quiet minutes. No endless feed. No pressure. Just the next clear step."
- Patient tutor: "The AI explains in your language, at your pace. Real mentors are one tap away when you need them."
- Built where it's needed: "Made in Dhaka by educators, designers, and engineers. Built for learners across Bangladesh and beyond."
- Principles: each card to one short sentence, max 12 words.
- Story: three short sentences per paragraph.
- Sticky-card quote: "Education should feel like a guide walking beside you, not a wall in front of you."
- Final CTA: "One small lesson. One calm streak. Everything changes from there."

### Mobile layout (under 640px)
- Hero min-h 78vh, tighter padding, full-width stacked CTAs.
- Stats: 2 cols, smaller cards.
- Image+Text: image first then copy, rounded 1.5rem, 4/5 aspect, edge-bleed.
- Story meta card: not sticky on mobile, sits below copy, compact.
- Principles carousel: 88% basis, edge bleed.
- Testimonials: 90% basis, larger quote mark.
- Final CTA: smaller headline, full-width button.

### Desktop layout (1024px+)
- Hero: 12-col grid, headline col-span-8, soft right gradient.
- Stats: 4-col row with hairline dividers, no card backgrounds for cleaner look.
- Image+Text: alternate 7/5 and 5/7 asymmetric splits.
- Story: 7/5, sticky meta pinned at top-28.
- Principles: 4 visible cards + peek of 5th.
- Testimonials: 3 visible, center card slightly scaled.
- Final CTA: large display headline, primary CTA, text link below.

### Files
- src/pages/About.tsx (all sections)
- src/index.css (only if helper classes needed)

### Out of scope
New sections, new images, content beyond About.
