## Redesign: Mentorship home section

**File:** `src/components/mentorship/MentorshipHomeSection.tsx`

### Goals
- Full-width, low-height horizontal banner (not a tall bento card).
- Background uses the brand gradient (`var(--gradient-primary)` — dark red), with `text-primary-foreground`.
- Clearly communicates: this is for parents to find a **home tutor** for their child, with a **free demo class** offer.
- Copy is warm, natural, full sentences — no robotic AI phrasing, no bullet word-soup.

### Layout (new)
```
┌─────────────────────────────────────────────────────────────────────────┐
│  [icon]  Find a trusted home tutor for your child                       │
│          Book a free demo class today and meet a verified teacher       │
│          before you decide. No commitment, no payment upfront.          │
│                                                  [Book free demo →]     │
└─────────────────────────────────────────────────────────────────────────┘
```

- One row on desktop: icon chip (left) · heading + supporting sentence (center, flex-1) · CTA button (right).
- On mobile: stacks to icon+heading, sentence, then full-width CTA button.
- Height stays compact (~`py-5 lg:py-6`), no tall hero feel.
- Removes the right-column trust list and the "Meet the mentors" secondary button — they made the card tall and cluttered. Trust info is folded into one short sentence under the heading.
- Keeps subtle ambient glow accents but tones them down so the banner reads as a single solid brand strip.

### Copy (final, conversational, full sentences)
- **Eyebrow chip:** "For parents"
- **Heading:** "Find a trusted home tutor for your child."
- **Supporting line:** "Book a free demo class today, meet a background-checked teacher, and only continue if it feels right for your family."
- **Primary CTA:** "Book a free demo" → `/mentors`

### Visual details
- Container: `rounded-3xl`, `border border-primary/30`, `background: var(--gradient-primary)`, all text via `text-primary-foreground` and `text-primary-foreground/80`.
- Icon chip: `bg-white/15 backdrop-blur` square with `GraduationCap`.
- CTA button: `variant="secondary"` (light pill on dark gradient) with `ArrowUpRight` icon for contrast against the red background.
- Ambient glow blobs kept but reduced opacity so the banner stays clean and low-height.

### Out of scope
- No changes to routing, `/mentors` page, or waitlist sheet.
- No changes to `Index.tsx` placement.
