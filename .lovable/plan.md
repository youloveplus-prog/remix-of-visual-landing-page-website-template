Goal: Make the Quick Actions section dramatically more compact while surfacing all items for instant access — no "See all" sheet required.

```
Current:  1 featured (full-width) + 5 bento tiles (2-col) + "See all" sheet
Proposed: 1 compact featured row + 18-item dense icon grid (4-col mobile, 6-col desktop)
```

### Changes

1. **Featured tile — compress to a horizontal banner**
   - Same `bg-primary` and blur accents
   - Height reduced from `min-h` bento to a single compact row (~56–64px)
   - Icon left, label + kicker middle, arrow right
   - Removes the large vertical footprint while keeping prominence

2. **Inline all-access icon grid — replace bento tiles with a dense app-launcher grid**
   - Use ALL_TILES (18 items) rendered as small icon + label cells
   - 4 columns on mobile, 5–6 on desktop (gap-2, p-2)
   - Each cell: 40×40 rounded-xl icon container + 2-line 10px label
   - No kickers on grid items (reduces noise); keep label only
   - Hover: subtle `bg-primary/5` tint + `scale-105`

3. **Remove the "See all" Sheet**
   - All items are now visible inline
   - Remove Sheet, SheetTrigger, SheetContent, SheetTile
   - Remove TILES array (replaced by ALL_TILES inline)

4. **Section spacing reduction**
   - Header margin `mb-5` → `mb-3`
   - Section padding tighter
   - "Dashboard" kicker + "Quick Actions" title can stack even more compactly

### Result
- Vertical space: ~60% reduction vs current bento layout
- Access: 100% of quick actions visible without interaction (was 6/18)
- Interaction: single tap on any item, no sheet navigation
- Visual density matches the "workspace command center" intent