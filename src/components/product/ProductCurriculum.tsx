import { ChevronDown, Play, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CurriculumModule {
  module: string;
  lessons: number;
  duration: string;
  /** First module unlocks free preview lessons. */
  freePreview?: boolean;
}

interface ProductCurriculumProps {
  modules: CurriculumModule[];
}

/**
 * Collapsible curriculum list — first module open by default so users see
 * what's inside without an extra click. Pure CSS animation via Tailwind's
 * accordion-down/up keyframes; respects reduced motion.
 */
export function ProductCurriculum({ modules }: ProductCurriculumProps) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <ol className="space-y-2">
      {modules.map((m, i) => {
        const isOpen = open.has(i);
        const isFree = m.freePreview ?? i === 0;
        return (
          <li
            key={m.module}
            className="rounded-2xl border border-border/60 bg-card overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={`curriculum-panel-${i}`}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3.5 text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                "hover:bg-muted/40 transition-colors",
              )}
            >
              <span className="grid place-items-center h-9 w-9 rounded-full bg-muted text-[12px] font-semibold tabular-nums shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold truncate">{m.module}</p>
                <p className="text-[12px] text-muted-foreground">
                  {m.lessons} lessons · {m.duration}
                </p>
              </div>
              {isFree && (
                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/15 text-success">
                  Preview
                </span>
              )}
              <ChevronDown
                aria-hidden
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <div
                id={`curriculum-panel-${i}`}
                className="px-4 pb-4 pt-1 motion-safe:animate-fade-in"
              >
                <ul className="divide-y divide-border/40">
                  {Array.from({ length: Math.min(m.lessons, 4) }).map((_, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-3 py-2.5 text-[13px]"
                    >
                      {isFree && j === 0 ? (
                        <Play className="h-3.5 w-3.5 text-primary shrink-0" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      )}
                      <span className="flex-1 truncate text-foreground/80">
                        Lesson {j + 1} — {m.module.split("—")[1]?.trim() || "Concepts"}
                      </span>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {Math.round(parseFloat(m.duration) * 60 / m.lessons) || 8}m
                      </span>
                    </li>
                  ))}
                  {m.lessons > 4 && (
                    <li className="py-2.5 text-[12px] text-muted-foreground">
                      + {m.lessons - 4} more lessons
                    </li>
                  )}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
