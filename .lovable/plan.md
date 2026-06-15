## Fix: Learn Icon Mismatch in Bottom Navigation

### Problem
The **Learn** tab in `BottomNav.tsx` uses the stock Lucide `BookOpen` icon, while all other tabs (Home, Explore, Community, Profile) use custom-designed SVG icon pairs with distinct outline and fill states. This creates a visual inconsistency in stroke weight, icon style, and active-state appearance.

### Solution
Replace the `BookOpen` import with a custom **Learn** SVG icon pair that matches the existing icon system:

1. **Create outline variant** — A book/graduation-cap style icon using `viewBox="0 0 24 24"`, `stroke="currentColor"`, `strokeWidth={1.5}`, matching the line-art style of Home, Community, and Profile outline icons.
2. **Create fill variant** — The same icon shape with `fill="currentColor"` and matching solid styling, consistent with HomeFill, CommunityFill, and ProfileFill.
3. **Update `BottomNav.tsx`** — Swap the `BookOpen` references for the new custom Learn outline/fill components in the `tabs` array.

### No other files touched.
This is a scoped visual fix to the mobile bottom navigation only.