## Goal
Add a Clickity-style desktop hero/bento section to the home page (visible on `lg:` and up only). Mobile UI stays untouched. Existing desktop sections below the new bento are preserved.

## Layout (desktop, lg+ only)

```text
            Eyebrow: "AI-powered learning, made simple"
                    Master AI, Python &
                    modern skills today.

         [  Drop a topic, course, or skill...   [ Start learning ▸ ] ]

  ┌──────────────┐ ┌──────────────────────┐ ┌──────────────────┐
  │  Drop a Link │ │   Create Your Path   │ │   AI Tutor       │
  │   (yellow)   │ │   (mint, tall)       │ │   (lavender)     │
  ├──────────────┤ │   hero image/avatar  ├──────────────────┤
  │ Use Template │ │                      │ Connect Account  │
  │   (sky)      │ │                      │   (yellow)       │
  └──────────────┘ └──────────────────────┘ └──────────────────┘
```

3 columns. Left + right columns each split into 2 stacked tiles. Center column is a single tall tile spanning both rows. Tiles use soft pastel backgrounds (amber-100, emerald-100, violet-100, sky-100, amber-100) with brand primary accents for icons and CTA pills. Each tile has an icon chip in the top-left, a heading, and an inline mini-CTA matching its theme (search input pill, hero portrait, mock preset card, mock template card, "Connect" pill).

## Scope

- New file: `src/components/home/desktop/DesktopHeroBento.tsx` — self-contained, only renders content; visibility controlled by parent wrapper.
- Edit: `src/pages/Index.tsx` — render `<div className="hidden lg:block"><DesktopHeroBento /></div>` as the FIRST child inside `<MobilePage>` (both signed-in and signed-out branches). Wrap `<FlexiTopSection />` in `<div className="lg:hidden">` so the mobile-only top section is hidden on desktop.

## Visual treatment

- Section container: `container-editorial` width, generous vertical padding.
- Eyebrow: small muted-foreground caps text.
- Headline: `font-display font-bold text-5xl xl:text-6xl tracking-tight` centered.
- Search bar: large white pill, `rounded-full border border-border shadow-lg`, leading link icon, right-side primary CTA button using `--gradient-primary`.
- Bento grid: `grid grid-cols-3 grid-rows-2 gap-5 min-h-[480px]`. Tiles `rounded-3xl p-6` with pastel bg + matching dark text. Icon chip = white circle, `w-9 h-9 rounded-full`, with brand-tinted icon.
- All routes hook into existing pages (`/shop`, `/shop?type=courses`, `/ai-tutor`, `/learn`, `/profile`).

## Out of scope
No data, hook, auth, or mobile changes. No new dependencies. Existing carousels and sections below render exactly as before on desktop.
