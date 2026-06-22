import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownClockProps {
  /** ISO target date. Past dates render as 00s. */
  target: string;
  className?: string;
}

interface Parts {
  d: number;
  h: number;
  m: number;
  s: number;
}

function diff(targetMs: number): Parts {
  const ms = Math.max(0, targetMs - Date.now());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { d, h, m, s };
}

const CELLS: Array<[keyof Parts, string]> = [
  ["d", "Days"],
  ["h", "Hours"],
  ["m", "Mins"],
  ["s", "Secs"],
];

export function CountdownClock({ target, className }: CountdownClockProps) {
  const targetMs = new Date(target).getTime();
  const [parts, setParts] = useState<Parts>(() => diff(targetMs));

  useEffect(() => {
    if (Number.isNaN(targetMs)) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const tick = () => setParts(diff(targetMs));
    const start = () => {
      tick();
      id = setInterval(tick, 1000);
    };
    const stop = () => {
      if (id) clearInterval(id);
      id = undefined;
    };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [targetMs]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 sm:gap-3 justify-center",
        className,
      )}
      role="timer"
      aria-label="Time until event"
    >
      {CELLS.map(([key, label]) => (
        <div
          key={key}
          className="min-w-[64px] sm:min-w-[78px] rounded-2xl bg-card border border-border/60 shadow-sm px-3 py-3 text-center"
        >
          <div className="font-display font-bold text-3xl sm:text-4xl tabular-nums text-foreground leading-none">
            {String(parts[key]).padStart(2, "0")}
          </div>
          <div className="mt-1.5 font-dot text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
