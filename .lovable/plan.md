## Plan: Center-align & auto-scroll the "What we believe" section

### What to change
1. **Center-align the carousel**
   - Change `align: "start"` to `align: "center"` in the PrinciplesCarousel Embla config.
   - Remove the asymmetric `pl-[max(1rem,calc((100vw-72rem)/2))]` padding on the carousel wrapper so cards appear centered on all screen sizes.
2. **Auto-move the cards**
   - Import the `Autoplay` plugin from `embla-carousel-autoplay` (already imported for TestimonialsCarousel).
   - Pass it into the `useEmblaCarousel` hook with a ~4000ms delay and `stopOnInteraction: false`.
3. **Optional polish**
   - Keep the dot pagination functional; autoplay will trigger `select` events naturally.

### Files touched
- `src/pages/About.tsx` (PrinciplesCarousel component only)