# AI Tutor mobile redesign — match Lovable chat layout

Reference: uploaded Lovable mobile chat screenshot. Goal: same visual structure (top model-pill header, scrollable transcript, horizontal action chips, rounded composer with leading + and ⋯ buttons, accent action button, mic, stop), and the composer must stay sticky above the bottom nav while the transcript scrolls.

Scope: mobile (<lg) only. Desktop layout unchanged.

## 1. `src/pages/Learn.tsx`
- Re-enable `AppLayout showBottomNav` (regression from earlier change — user explicitly wanted bottom nav kept on AI page).
- Remove the floating `ThreadListSheet` absolute trigger; the trigger moves into the new in-chat header.
- Mobile container height: `h-[calc(100dvh-var(--app-header-h,56px)-var(--bottom-nav-h,64px))]` so the chat column sits exactly between the global header and the bottom nav.

## 2. `src/components/learn/LearnChat.tsx` — full layout rewrite (logic untouched)
Three-row flex column inside the chat container:

```text
┌────────────────────────────────────────┐
│ Header row (sticky top)                │  ← hamburger | model pill | new-chat
├────────────────────────────────────────┤
│ Transcript (flex-1, overflow-y-auto)   │  ← messages / empty state
│                                        │
├────────────────────────────────────────┤
│ Action chips (horizontal scroll)       │  ← optional quick prompts
│ Composer card (rounded, sticky)        │  ← + ⋯ ▸ textarea ▸ accent | mic | send/stop
└────────────────────────────────────────┘
```

Header row:
- Left: hamburger button → opens `ThreadListSheet`.
- Center: pill button showing current thread title (or "ASIKON Tutor") with chevron-down — opens the same sheet.
- Right: small icon button (new chat / play-style affordance).
- `sticky top-0 z-10 bg-background/80 backdrop-blur` so it stays put while transcript scrolls.

Transcript:
- Keep existing `MessageRow` rendering, empty state, jump-to-latest pill, auto-scroll, award logic.
- Add bottom padding so last message clears the composer.

Action chips (only when there are messages, mirroring Lovable's "Show signed-in chat / Enable prompt cards / Open …"):
- Horizontal scroll row of 3–4 contextual chips: "নতুন প্রশ্ন", "Quiz বানাও", "সহজ করে বলো", "Bangla তে বলো". Tapping inserts the text into the input (not auto-send).
- Hidden in empty state (quick prompt cards already cover that case).

Composer card (sticky):
- Outer wrapper: `sticky bottom-0` with gradient fade above it. This is the key fix — it stays glued to the bottom of the scroll container while the transcript scrolls.
- Card: rounded-3xl, border, `bg-card/95 backdrop-blur`, subtle shadow.
- Top row inside card: full-width auto-grow `textarea` (placeholder "Queue follow-up…" style, Bangla: "তোমার প্রশ্ন লেখো…"), `max-h-[160px]`.
- Bottom row inside card (icon strip):
  - Left cluster: round `+` button (attach — visual only for now, opens toast "শীঘ্রই আসছে"), round `⋯` button (opens small popover with "Clear chat", "Copy last answer").
  - Right cluster: accent round button using `gradient-primary` (primary action — sends current input, same as ↑), `mic` button (visual only, toast), `send/stop` button (ArrowUp when idle, Square when streaming — wired to existing `handleSend` / `stop`).
- Small disclaimer line under card kept.

Visual tokens: reuse semantic tokens (`bg-card`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-secondary`). No raw colors.

## 3. Bottom-nav height variable
- In `src/components/layout/BottomNav.tsx` (or wherever the mobile bottom nav lives), set `style={{ ['--bottom-nav-h' as any]: '64px' }}` on the root, or define `--bottom-nav-h: 64px` in `index.css` `:root`. Used by Learn.tsx height calc.

## Out of scope
- No edge function / backend changes.
- No persistence or thread CRUD changes.
- No desktop layout changes beyond what falls out of shared components.
- The `+`, `⋯`, mic, and accent buttons render but only the send/stop button is wired; others show a "coming soon" toast. (Confirm if you want any of them wired now.)

## Verification (mobile 393×701)
1. Open `/learn/:threadId` while signed in → header pill, transcript area, composer all visible; bottom nav visible below composer.
2. Scroll transcript → composer + header stay pinned; bottom nav stays pinned.
3. Type multi-line → textarea grows up to 160px, composer height grows but stays anchored to bottom.
4. Tap hamburger or model pill → thread sheet opens.
5. Send a message → optimistic user bubble appears, "চিন্তা করছি…" shimmer, then assistant streams as plain markdown.
6. Tap a chip → text inserted into input, focus stays in textarea.
