# New · Coming soon section

Add a new section to the home page showing 3 upcoming items: one course, one book, one teaching service. Layout inspired by the reference (3-column card row with category chip, title, subtitle, and visual).

## Placement

`src/pages/Index.tsx` — insert directly after `<MasterpieceShowcase />` (in both logged-in and logged-out branches) so it sits within the discovery flow.

## New component

`src/components/home/ComingSoonTrio.tsx`

- Section header: "New · Coming soon" (Space Grotesk), small subtitle "Fresh drops landing soon".
- Grid: `grid-cols-1 md:grid-cols-3 gap-4`.
- Three cards, each:
  - Category chip pill ("Course" / "Book" / "1-on-1 Teaching")
  - Title + one-line subtitle
  - Visual area (image or illustrative tile) at bottom
  - "Coming soon" status badge with countdown-style dot
  - Hover lift + glow using existing `midnight-tile` / brand dark-red gradient tokens
- CTA per card: "Notify me" → opens existing `MentorWaitlistSheet` for the teaching card; for course/book, routes to `/courses` and `/shop` respectively with a toast "We'll notify you on launch".

## Card content (initial static seed)

1. **Course** — "Agentic AI Engineering" · "Build production AI agents end-to-end" · launches Q3
2. **Book** — "Prompting in Practice" · "Field guide for serious AI users" · launches next month
3. **Teaching** — "1-on-1 Python for Kids" · "Personal tutor, weekly sessions" · waitlist open

Images: reuse existing course/book covers from `src/assets` where available; otherwise generate 3 brand-aligned illustrations (dark red gradient, glass) at 1024x1024.

## Styling

- Use semantic tokens only (`bg-card`, `text-foreground`, `border-border`, `--gradient-primary`).
- Each card gets a distinct accent: course = primary red gradient, book = muted glass, teaching = accent highlight — all within brand palette (no neon green from reference).
- Rounded `rounded-3xl`, `p-5`, subtle ring on hover.

## Out of scope

- No backend table; static array in component for now. Easy to swap to Supabase later.
