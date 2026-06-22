import { Link } from "react-router-dom";
import { Crown, Coins } from "lucide-react";

const LEADERS = [
  { rank: 1, name: "Arif H.", coins: 12480 },
  { rank: 2, name: "Sara M.", coins: 11020 },
  { rank: 3, name: "Naim K.", coins: 9870 },
];

export function GameTeaser() {
  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-[12px] border border-white/10 bg-gradient-to-br from-neutral-950 to-black p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-[hsl(var(--hf-accent))]/15 blur-3xl"
          />
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--hf-accent))]">
            <Coins className="h-3.5 w-3.5" /> Earn coins
          </span>
          <h2 className="mt-3 font-display text-xl sm:text-2xl font-medium tracking-tight leading-tight text-white">
            Learn. Play. Earn up to 100 coins a day.
          </h2>
          <p className="mt-2 max-w-sm text-[13px] text-white/55">
            Daily quizzes and streaks turn into coins you can spend on courses, books, and mentor sessions.
          </p>
          <Link
            to="/game"
            className="mt-5 inline-flex h-10 items-center rounded-md bg-[hsl(var(--hf-accent))] px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:opacity-90"
          >
            Play now
          </Link>
        </div>
        <div className="rounded-[12px] border border-white/10 bg-neutral-950 p-6">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Top earners · this week
            </div>
            <Link
              to="/leaderboard"
              className="text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-[hsl(var(--hf-accent))]"
            >
              Full board →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-white/5">
            {LEADERS.map((l) => (
              <li key={l.rank} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-[12px] font-bold text-white">
                    {l.rank === 1 ? <Crown className="h-4 w-4 text-[hsl(var(--hf-accent))]" /> : l.rank}
                  </span>
                  <span className="text-[14px] font-medium text-white">{l.name}</span>
                </div>
                <span className="text-[13px] font-semibold text-[hsl(var(--hf-accent))]">
                  {l.coins.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
