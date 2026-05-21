## Overview

Apply 7 targeted fixes across frontend, hooks, layout, and one Supabase migration. Implementation order minimises rework: migration first (types regenerate), then hook update, then UI.

---

## FIX 1 — Remove `any` cast in `useGameData.ts`

- Delete `const db: any = supabase;`
- Replace all `db.from(...)` → `supabase.from(...)`
- All referenced tables (`learner_profiles`, `lesson_completions`, `lessons`, `daily_missions`, `milestones`, `profiles`) already exist in `src/integrations/supabase/types.ts`, so no manual casts should be needed. If any narrow spot complains, use `as Tables<'...'>` from generated types — never `any`.

## FIX 2 — Wire up Game page Quick Actions

In `src/pages/Game.tsx`:
- Add state for `rankOpen`, `historyOpen`, `rulesOpen`.
- Reuse existing `LeaderboardSheet` (`src/components/game/LeaderboardSheet.tsx`), `HistorySheet` (already exists with correct query), and `RulesDialog` (`src/components/game/RulesDialog.tsx`). Verify these match the spec; if `LeaderboardSheet` doesn't fetch top 10 with join + current-user highlight, update it. If `RulesDialog` content differs, update copy.
- Wire each quick action button's `onClick` to open the respective sheet/dialog.
- Invite button: `navigator.share({title, text, url})` with try/catch; fallback to `navigator.clipboard.writeText` + toast `"Link copied to clipboard!"`.

## FIX 3 — Move `ErrorBoundary` to `main.tsx`

- `src/main.tsx`: already wraps with `ErrorBoundary` (verified in context). Confirm no duplicate in `App.tsx`; if present, remove it. Keep `ErrorBoundary.tsx` file untouched.

## FIX 4 — Supabase migration: XP/coin/streak trigger

Single migration with the 4 SQL steps from the spec:
1. `ALTER TABLE learner_profiles ADD COLUMN IF NOT EXISTS longest_streak ...` (already exists per schema, the `IF NOT EXISTS` makes it safe).
2. `CREATE OR REPLACE FUNCTION award_lesson_completion()` — SECURITY DEFINER, sets `app.grant_rewards = on` so the existing `protect_*` triggers allow xp/coins/streak writes.
3. Drop & create `on_lesson_completed` AFTER INSERT trigger.
4. After migration: update `useGameData.ts` — select `xp,streak_days,longest_streak` and return `longestStreak: learnerRes.data?.longest_streak ?? 0`.

Note: existing `handle_lesson_completion()` function already does similar work but isn't attached as a trigger (no triggers in DB). The new `award_lesson_completion` replaces that role per spec. Must include `PERFORM set_config('app.grant_rewards', 'on', true);` before updates because `protect_learner_profile_fields` and `protect_profile_privileged_fields` block direct xp/coin writes otherwise.

## FIX 5 — Add Game/Earn tab to BottomNav

- `src/components/layout/BottomNav.tsx`: replace tab array with the 5 specified (Home/Explore/Earn/AI/Profile). Read file first to preserve animation/styling structure.
- `src/lib/nav-map.ts`: add `"game"` to TabId union and map `/game` → `"game"`.

## FIX 6 — ThemeToggle component

- Create `src/components/ui/ThemeToggle.tsx` using `next-themes` `useTheme()`. Sun in dark mode, Moon in light. `Button variant="ghost" size="icon" className="h-9 w-9 rounded-full"`.
- Verify `next-themes` is already installed and `ThemeProvider` is mounted; if missing, add `next-themes` and wrap in `main.tsx` with `defaultTheme="dark"` to keep dark default.
- Insert `<ThemeToggle />` into `MobileHeader.tsx` (before cart) and `DesktopHeader.tsx` (next to user menu).

## FIX 7 — Randomised AiAssistantBox chips

- In `src/components/home/workspace/AiAssistantBox.tsx`: replace `CHIPS` constant with `ALL_CHIPS` (8 entries from spec) + `const CHIPS = useMemo(() => [...ALL_CHIPS].sort(() => Math.random() - 0.5).slice(0, 3), [])`. Import `useMemo`.

---

## Execution order

1. Run Supabase migration (Fix 4 SQL) — wait for approval & types regen.
2. Edit `useGameData.ts` (Fix 1 + Fix 4 select change) together.
3. Frontend edits in parallel: Game.tsx (Fix 2), App.tsx/main.tsx check (Fix 3), BottomNav + nav-map (Fix 5), ThemeToggle + headers (Fix 6), AiAssistantBox (Fix 7).

## Constraints respected

- No changes to `/asikonasik`, AdminGuard, auth flow, or RLS policies.
- Dark theme remains default.
- Trigger is `SECURITY DEFINER` and toggles `app.grant_rewards` to satisfy existing protective triggers.
- Mobile-first; all new UI sized for 375px.
