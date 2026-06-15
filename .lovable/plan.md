## Course Detail Page — Plan

Build a new `/courses/:slug` detail page modeled on the reference (learnspring UX Design Beginner layout), reusing our existing warm cream + indigo bento theme (not the reference's red/cream — we keep brand tokens).

### 1. Route & file
- Add `src/pages/CourseDetail.tsx`
- Register route in `src/App.tsx`: `<Route path="/courses/:slug" element={<CourseDetail />} />`
- Link cards in `CoursesList.tsx` to `/courses/<slug>`

### 2. Layout (desktop ≥lg, two-column inside `AppLayout`)
```text
┌─ Breadcrumb: Our Courses / All Courses / <Title> ──────── [search] ┐
│                                                                    │
│ ┌──────────────── Video / Cover ─────────────┐  ┌─ Your Progress ─┐│
│ │  16:9 hero with play overlay + scrubber    │  │ 3 / 20          ││
│ └────────────────────────────────────────────┘  │ ○ Lesson 1  ✓   ││
│ ┌─ Instructor row (avatar, name, handle) ───┐  │ ○ Lesson 2  ✓   ││
│ │  ★ 4.3   ◷ 8 weeks   ▤ 14 lessons         │  │ ○ Lesson 3      ││
│ └────────────────────────────────────────────┘  │   …             ││
│ ┌─ Tabs: Description ▾ ─────────────────────┐  │                 ││
│ │  Long course description paragraphs       │  │                 ││
│ └────────────────────────────────────────────┘  └─────────────────┘│
└────────────────────────────────────────────────────────────────────┘
```
- Mobile: single column, progress collapses below content.

### 3. Components (all in `src/components/course-detail/`)
- `CourseBreadcrumb.tsx` — chevron-separated trail using `lucide-react`.
- `CourseVideoCard.tsx` — `surface-panel` rounded-3xl, 16:9 `<video>`/poster, gradient overlay, big play button, mock progress bar + time + volume/expand icons.
- `CourseMetaRow.tsx` — instructor avatar + name/email, right side chip cluster: rating, duration, lessons (indigo chips using existing chip utilities).
- `CourseDescription.tsx` — `surface-panel-soft` card with header "<Course Title>" + "Description ▾" dropdown trigger (shadcn `DropdownMenu`) and 2–3 paragraph body.
- `CourseProgressCard.tsx` — sticky right rail (`lg:sticky lg:top-24`), header "Your Progress  3/20", scrollable `ul` of lessons. Each row: filled indigo circle with check (completed), outlined circle (pending), lesson title truncated.

### 4. Data
- Add `src/data/courseDetails.ts` exporting a `getCourseDetail(slug)` mock returning `{ title, instructor, rating, duration, lessons, description, videoPoster, progress: { completed, total, items: [{id,title,done}] } }`.
- Use placeholder poster from existing `src/assets` (pick a course/learning image) and a sample mp4 from `/public` if available, otherwise just poster + play button (no real playback).

### 5. Styling rules
- Use only semantic tokens (`bg-card`, `text-foreground`, `border-border`, `surface-panel`, `surface-panel-soft`, chip utilities). No hardcoded colors. Full dark-mode parity (run audit after).
- Plus Jakarta Sans inherited; lesson numbers in Departure Mono via `font-mono` utility we already alias.

### 6. Acceptance
- `/courses` cards navigate to detail page.
- Detail page matches reference structure: breadcrumb, hero video, instructor+meta chips, description card with dropdown, right progress rail with check/empty states.
- Looks correct in light and dark themes; passes `node scripts/audit-light-bg.js` with zero new CRITICAL hits.
