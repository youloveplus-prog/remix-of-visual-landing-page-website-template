import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STEP_LABELS,
  STEP_ORDER,
  type SocraticStep,
} from "@/lib/socraticParse";

interface Props {
  step: SocraticStep | null;
  hintLevel: number | null;
  topicHint?: string | null;
  className?: string;
}

/**
 * Compact reasoning rail rendered above the assistant turn.
 * Shows the four Socratic steps (Understand → Plan → Try → Check),
 * highlights the current one, marks earlier ones complete, and
 * surfaces hint level + topic.
 */
export function SocraticRail({ step, hintLevel, topicHint, className }: Props) {
  if (!step || step === "direct") return null;

  const currentIdx = STEP_ORDER.indexOf(step);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/60 backdrop-blur-sm px-3 py-2 mb-2",
        className,
      )}
      aria-label="Tutor reasoning step"
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        {STEP_ORDER.map((s, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          return (
            <div key={s} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <div
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  isCurrent && "text-primary",
                  isDone && "text-foreground/70",
                  !isCurrent && !isDone && "text-muted-foreground/60",
                )}
              >
                <span
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 rounded-full grid place-items-center text-[9px] sm:text-[10px] font-mono font-semibold shrink-0",
                    isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                    isDone && "bg-foreground/15 text-foreground/70",
                    !isCurrent && !isDone && "bg-muted text-muted-foreground/70",
                  )}
                >
                  {isDone ? <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : idx + 1}
                </span>
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.08em] hidden sm:inline",
                    isCurrent && "font-semibold",
                  )}
                >
                  {STEP_LABELS[s]}
                </span>
                {isCurrent && (
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] sm:hidden">
                    {STEP_LABELS[s]}
                  </span>
                )}
              </div>
              {idx < STEP_ORDER.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    "h-px w-2 sm:w-4 shrink-0",
                    idx < currentIdx ? "bg-foreground/30" : "bg-border",
                  )}
                />
              )}
            </div>
          );
        })}
        {(hintLevel ?? 0) > 0 && (
          <span
            className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-mono font-medium shrink-0"
            title={`Hint level ${hintLevel} of 5`}
          >
            💡 {hintLevel}/5
          </span>
        )}
      </div>
      {topicHint && topicHint !== "general" && (
        <div className="mt-1 text-[10px] font-mono text-muted-foreground/70 truncate">
          topic · {topicHint}
        </div>
      )}
    </div>
  );
}
