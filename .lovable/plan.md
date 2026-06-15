# Home Page — Quiet & Clear Pass

Goal: remove visual noise, cut redundant words, and lock typography into a strict 3-size scale so every spread feels like the same magazine.

## 1. One typography scale (shared)

Replace ad-hoc sizes per component with a small token set in `index.css`:

- `editorial-display` — hero only (cover headline)
- `editorial-headline` — spread H2 (Issue Index, Feature Story)
- `editorial-subhead` — department H3 / card titles
- `editorial-dek` — body paragraph
- `editorial-eyebrow` — mono label (smaller, calmer letter-spacing 0.18em)
- `editorial-pagenum` — folio/number

Mobile-tuned sizes (locked, no inline `text-3xl/text-5xl` in components anymore):

```text
display    : clamp(2.25rem, 10vw, 5.5rem)   / leading 0.98
headline   : clamp(1.625rem, 5.5vw, 2.75rem) / leading 1.1
subhead    : 1.125rem → 1.25rem desktop      / leading 1.25
dek        : 0.9375rem → 1rem desktop        / leading 1.6, color muted
eyebrow    : 0.625rem, tracking 0.18em       / muted-foreground/80
```

All headlines get `text-wrap: balance`; deks get `text-wrap: pretty`.

## 2. Copy refinements (shorter, plainer)

| Where | Before | After |
|---|---|---|
| Cover eyebrow (right) | "An AI-powered learning journal" | (remove on mobile, keep on lg+ as "Learning journal · 2026") |
| Cover headline | "Learning, re-imagined for every student." | "Learning, re-imagined." (2 lines, calmer) |
| Cover pullquote | 2-sentence editor's note | "The calmest place on the internet to learn." (single line) |
| Cover CTAs | "Enter the library" / "Find a 1-on-1 mentor" | "Browse courses" / "Find a mentor" |
| Issue Index H2 | "Why we exist." | "Why ASIKON." |
| Issue Index right | "Contents" list with hover "Read →" | Drop hover hint, keep numbered list |
| Feature Story eyebrow | "Cover course" | "This week" |
| Feature Story dek | 2-sentence paragraph | one sentence |
| Feature Story CTA | "Read the syllabus" | "View course" |
| Trust spread label | "Why learners trust us" | "Trust" |
| Trust slide titles | Long sentences | 4–6 words each |
| Department deks | 1–2 sentences each | one short clause each |
| Back Matter colophon | Long sentence | "Set in Plus Jakarta Sans. Made in Dhaka." |
| Page folios | "ASIKON / EDITION 06" + "01 / 05" both sides | left side only; folio simplifies to `01` |

## 3. Spread structure cleanup

- Remove the small "Read →" hover label on the TOC — extra ink.
- Remove the bottom-left folio text ("ASIKON / EDITION 06"); keep only the right-side page number for a single calm marker.
- Spread top label rule: thinner (0.5px equiv via opacity 0.5), shorter label tracking, no double rule on cover.
- Department header: drop the long horizontal rule; replace with a single 24px tick before the number.
- Trust carousel: drop the `Sparkles` pill from the feature image and the eyebrow chip inside slides — title + body is enough.

## 4. Rhythm

- Mobile vertical rhythm: `space-y-12` between spreads (was 14). Inside-spread: `space-y-6`.
- Spread side padding: `px-5` mobile, `px-8` sm, `px-12` lg.
- Headline → dek: 12px. Dek → CTA: 24px. Standardized across Cover / Feature / Index.

## 5. Files to touch

- `src/index.css` — add the 6 typography tokens, retire ad-hoc sizes.
- `src/components/home/editorial/EditorialCover.tsx` — copy, CTA labels, drop one line.
- `src/components/home/editorial/IssueIndex.tsx` — H2 copy, remove hover hint, use `editorial-headline`.
- `src/components/home/editorial/FeatureStory.tsx` — eyebrow, dek, CTA label, use shared tokens.
- `src/components/home/editorial/Spread.tsx` — single folio, thinner rule.
- `src/components/home/editorial/Department.tsx` — tick instead of long rule, shorter deks via prop.
- `src/components/home/editorial/TrustCarousel.tsx` — shorter titles, remove eyebrow chip.
- `src/components/home/editorial/BackMatter.tsx` — shorter colophon.
- `src/pages/Index.tsx` — spread label "Trust", department deks shortened, spacing tokens.

## 6. Out of scope

- No layout structure change (still magazine spreads, same order).
- No color/theme changes.
- No animation timing changes — existing motion stays.

Approve and I'll ship it in one pass.
