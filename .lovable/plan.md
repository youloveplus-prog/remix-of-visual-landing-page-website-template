# Optimize "From the community" homepage section

Make the carousel feel tighter on small screens, keep alignment consistent across breakpoints, and make every entry point land on the community page (including a clear per-card deep link, which currently doesn't exist).

## What's wrong today

1. Cards are huge on mobile — single image is `aspect-[4/3]` and skeleton hits `360–520px`, so one card eats the whole viewport vertically.
2. Header alignment differs from the rest of the homepage: it center-aligns on mobile while the page is left-aligned everywhere else, so the section looks misplaced when scrolling.
3. Slide widths jump 100% → 85% → 60% → 50%; the `md` step (60%) leaves an awkward half-card peek on tablets.
4. The whole card is not clickable — only the "View all" button leads to `/community`, and clicking a post does nothing. There's also no per-post route.
5. Mobile controls (arrows + dots) appear at the bottom but the section already has the carousel buttons hidden on mobile, so the section never shows an obvious "swipe" affordance until you actually try.
6. Embla `loop` flips on/off depending on `posts.length > 2`, which causes a re-init flicker when the live feed updates.

## What I'll change

### Alignment & responsiveness (`CommunityCarousel.tsx`)
- Header: left-aligned at every breakpoint, drop the `items-center / text-center` mobile branch so it matches the other home sections.
- Tighten heading scale: `text-xl sm:text-2xl md:text-[28px] lg:text-3xl`, subtitle clamps to 1 line on `xs`.
- Slide widths: `flex-[0_0_88%] sm:flex-[0_0_70%] md:flex-[0_0_48%] lg:flex-[0_0_calc(50%-10px)]` so the half-card peek is consistent.
- Skeleton heights drop to `h-[260px] sm:h-[340px] md:h-[420px]` to match the new card height.
- Always set `loop: true` (Embla no-ops when there aren't enough slides) and add `dragFree: false` so swipes snap cleanly.
- Add a subtle "Swipe →" eyebrow next to the dots on mobile the first time the carousel mounts.
- Move the section gap rhythm: `mt-3 md:mt-5` instead of `mt-4 md:mt-6`.

### Mobile card height (`PostCard.tsx`)
- Reduce single-image aspect from `aspect-[4/3]` to `aspect-[5/4]` on mobile (`sm:aspect-[16/11]` stays).
- Cap content area: caption clamps to 2 lines on mobile, 3 on `sm+`, with a "Read more" link to the community post.

### Routing — make every entry lead to community
- `PostCard` becomes a `<Link to={`/community/post/${post.id}`}>`-wrapped article. Interactive children (like, save, more) keep their own handlers and `stopPropagation`.
- Add a passthrough route in `src/App.tsx`: `/community/post/:id` → existing `CommunityPostDetail` page if present, otherwise redirect to `/community#post-{id}`.
- The whole section's "View all" stays as-is (already links to `/community`).
- The `LivePulse` chip becomes a link to `/community?filter=live`.
- The header title becomes a `<Link>` to `/community` for an extra entry point (styled as plain text, hover underline).

### Verification
- Re-run `tests/visual/homepage-layout.spec.py` to confirm the section still fits the layout assertions (it already covers `#departments` order + horizontal overflow at xs/md/lg).
- Add Playwright step to the same spec that clicks the first community card and asserts the URL ends in `/community/...`.

## Files touched

- edit: `src/components/community/CommunityCarousel.tsx`
- edit: `src/components/community/PostCard.tsx`
- edit: `src/App.tsx` (route alias if needed)
- edit: `tests/visual/homepage-layout.spec.py` (add navigation assertion)

## Out of scope

- No backend changes — uses existing `useCommunityFeed`.
- No new design tokens — sticks to current spacing/typography scale.
- Per-post detail page itself isn't built here; if the route doesn't exist, the deep link falls back to `/community?post=<id>` so we don't ship a 404.

Approve and I'll implement.
