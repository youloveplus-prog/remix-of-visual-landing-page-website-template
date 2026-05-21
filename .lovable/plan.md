
## Goal
Rebuild the AI Tutor page (`/learn`) to feel like a polished modern AI chat (ChatGPT, Gemini, Claude) while keeping the brand identity (dark-red gradient, glass surfaces, Apu persona). Composer must always sit flush above the mobile bottom navigation — never under it, never floating mid-screen.

## Scope
Files:
- `src/components/learn/LearnChat.tsx` — full structural rework
- `src/components/learn/ThreadList.tsx` — visual polish, time grouping, count
- `src/pages/Learn.tsx` — layout shell adjustments
- `src/components/layout/AppLayout.tsx` — verify `fillViewport` math (read-only unless it's the cause)

Out of scope: edge function logic, persistence, message schema, voice wiring.

---

## 1. Page layout (mobile-first, desktop-grand)

### Mobile (≤ lg)
```
┌─────────────────────────────────┐
│  ⇦ Apu — your tutor   ⊕   ⋯   │  ← slim glass header, brand wash
├─────────────────────────────────┤
│                                 │
│   Transcript (scrollable)       │
│   • user bubbles right          │
│   • Apu replies left, no bubble │
│   • streaming "Apu is typing"   │
│                                 │
│   [Jump to latest] (floating)   │
├─────────────────────────────────┤
│  pill composer  🎤  ⏹/⬆         │  ← sticky, above bottom nav
└─────────────────────────────────┘
         ▼ BottomNav (app shell)
```

### Desktop (≥ lg)
Two-column shell:
- Left rail (280px): ThreadList with search, grouped by time, hover/active states, new-chat button at top.
- Right column: same chat layout as mobile but wider (`max-w-3xl` content) with a slim top bar showing thread title, model label "Apu · GPT", and overflow menu (rename / share / delete) — Gemini-style.

---

## 2. Composer — never under the bottom nav

Root cause of the current intermittent overlap: the chat root is `flex flex-col h-full` inside `AppLayout`'s `fillViewport` main, which uses `h-[100dvh]` + `paddingBottom: var(--bottom-nav-h)`. `100dvh` recalculates on iOS Safari URL-bar collapse; with `sticky bottom-0` it still rides the bottom *of the scroll container*, which is fine — but our previous build kept `sticky bottom-0` AND `shrink-0` inside a flex column. Inside flex children, `position: sticky` is a no-op because the parent doesn't scroll. The composer was actually staying placed only because of the flex layout, and on viewport resize the bottom edge could land under the nav.

Fix (deterministic):
- Keep the chat root as `flex flex-col h-full min-h-0`.
- Composer remains the **last flex child with `shrink-0`** (so it's never under the nav as long as the parent's height is correct — which it is via `AppLayout` padding).
- Drop the misleading `sticky bottom-0` (it doesn't apply in this flex context).
- Add a CSS guard: composer wrapper uses `pb-[max(0.5rem,env(safe-area-inset-bottom))]` so the home-indicator area never eats into the input on iOS.
- In `AppLayout`, ensure `--bottom-nav-h` already includes safe-area (it does: `calc(58px + env(safe-area-inset-bottom))`). The padded main + composer-as-last-flex-child = composer always sits exactly on top of nav.
- Add a one-shot `ResizeObserver` on `window.visualViewport` to recompute `--app-vh` when the mobile keyboard opens, so when the user focuses the textarea the transcript shrinks and the composer rides above the keyboard (not behind it). Set `height: var(--app-vh, 100dvh)` on the chat root when on mobile.

Acceptance: open `/learn/:id` on a 393×701 viewport, scroll, focus textarea, rotate — composer is always visible directly above the bottom nav (or directly above the keyboard when it's open). Test passes on Chrome mobile emulation and the real preview viewport.

---

## 3. Chat surface (Gemini/ChatGPT-inspired, brand-local)

### Header (mobile)
- Slim 44px glass bar with a 12%-opacity brand-red wash.
- Left: back/menu (PanelLeft) opens thread sheet.
- Center: thread title pill, tap = switch chat sheet. Below title: tiny "Apu · Tutor" subtitle in muted-foreground.
- Right: New chat (`PenSquare`) + overflow menu (`MoreHorizontal`) with: Rename, Share link (copy), Clear history, Delete.

### Header (desktop)
- Same controls, plus a model/persona label chip ("Apu · SSC + HSC") and a "Share" icon button.

### Transcript
- Centered column `max-w-3xl`, vertical rhythm `space-y-6`.
- **User messages**: right-aligned bubble, `bg-primary text-primary-foreground`, rounded-2xl, soft brand shadow, max 85% width.
- **Apu messages**: left-aligned, no bubble — markdown rendered directly on the background (ChatGPT pattern). Avatar (24px) + name "Apu" pinned to the first line of each assistant turn.
- **Hover actions** on each assistant message (desktop) and **long-press** (mobile): Copy, Regenerate, Like/Dislike feedback (visual only, persisted later). These are subtle ghost icons that fade in.
- **Citations / sources**: if any `part.type === "source-url"` in the stream, render a `Sources` collapsible chip below the message (forward-compatible).
- **Streaming**: while `status === "streaming"`, show a subtle blinking caret at the end of the streaming text + the "Apu is typing…" indicator persists until first token.
- **Code blocks**: dark surface, language label top-right, copy-code button. Inline code already styled.
- **Day separators**: when two consecutive messages span midnight, insert a small "Today" / "Yesterday" / formatted date chip.

### Empty state
- Centered hero: animated brand-red glow behind Apu avatar.
- H1 "Hi, I'm Apu", warm subtitle.
- Quick-prompt grid (4 cards, current set) with brand-tinted icon chips and `hover:-translate-y-0.5`.
- Below grid: a tiny "What I'm good at" capability row (3 mini cards: "Explain concepts", "Practice with MCQs", "Plan revision").

### Composer
- Rounded-3xl card (not pill) on first turn for spaciousness (ChatGPT-style), collapses to slim pill after first send to maximize transcript room — toggleable via the existing minimize control.
- Top row inside card (when expanded): the textarea with auto-grow up to 8 lines.
- Bottom row inside card: left = Attach (paperclip, disabled tooltip "Files — coming soon"), Voice (mic, disabled tooltip). Right = character counter when >500 chars + Send/Stop button.
- Focus ring uses brand red glow.
- Action chips ("Explain like I'm 12", "In Bangla please", "Quiz me on this", "Give me an example", "TL;DR") shown above the composer once there's at least one message.

### Floating helpers
- "Jump to latest" pill — keep, position above composer (not absolute to viewport).
- Scroll-shadow at the top of the transcript when scrolled.

---

## 4. ThreadList polish

- Top: New chat button (kept) + search input (`Search threads…`).
- Group threads by recency: Today / Yesterday / Previous 7 days / Older.
- Each row: 14px message icon, title (truncate), tiny timestamp on the right, delete on hover (already exists, just refined).
- Active row: brand-tinted soft pill, no harsh background.
- Empty state: small illustration + "No chats yet — start your first conversation with Apu."
- Sheet header on mobile shows thread count.

---

## 5. Micro-interactions / motion

- New assistant message: fade-in (already), plus a 200ms subtle slide-up.
- Send button: 150ms scale tap, 500ms shimmer sweep on click.
- Stop button: pulse ring while streaming.
- Typing indicator: existing 3-dot bounce, but tied to the same Apu avatar inline.
- All animations respect `prefers-reduced-motion`.

---

## 6. Copy (kept warm, Apu persona)

No changes needed — all current strings already follow the Apu voice. Add new strings:
- Overflow menu: "Rename chat", "Share link", "Clear history", "Delete chat".
- Capability cards: "Explain any concept", "Quiz me with MCQs", "Plan my revision".
- Search placeholder: "Search your chats".
- Sources collapsible: "Where this came from".

---

## 7. Acceptance checklist

- [ ] Composer sits flush above bottom nav at 393×701, 360×800, and 414×896. Verified after focusing textarea (keyboard simulation) and after scrolling the transcript.
- [ ] No off-brand colors introduced; only `primary`, `gradient-primary`, semantic tokens.
- [ ] Assistant messages render with no background bubble; user messages keep brand pill.
- [ ] Empty state shows Apu avatar + 4 quick prompts + 3 capability cards.
- [ ] Streaming shows typing indicator + caret; Stop button replaces Send while busy.
- [ ] Each assistant message has Copy + Regenerate hover affordance (desktop) / tap-and-hold sheet (mobile).
- [ ] Thread list groups by recency and supports search filter.
- [ ] Header overflow menu present with Rename / Share / Clear / Delete (delete + rename wire to existing hooks; share copies a `/learn/:id` link to clipboard; clear is a confirm dialog stub).
- [ ] No console errors; no layout shift on first paint; lighthouse-style "looks like a real AI app" pass.
