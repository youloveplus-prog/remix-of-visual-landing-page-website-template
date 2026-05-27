## Changes

### 1. Recolor green → brand primary
The current lime/green (`#c8ff5a`) used in the "Free Coins" card and CTA button will be replaced with the project's brand primary color (`hsl(var(--primary))` / `#2836D9` indigo).

Affected areas in `src/components/home/ComingSoonTrio.tsx`:
- `TONES.lime` card background, CTA button background, decorative heart icon

### 2. Replace "Play" → "Learn"
All "Play" copy in the hero section will be updated to "Learn" to match the learning-platform brand identity.

Affected text:
- Chip: "Play for Free" → "Learn for Free"
- Subtitle: "Play without payment today!" → "Learn without payment today!"
- CTA button: "Play for Free!" → "Learn for Free!"

No other files touched.