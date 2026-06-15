import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProgressItem {
  id: string;
  title: string;
  done: boolean;
}

interface Props {
  completed: number;
  total: number;
  items: ProgressItem[];
}

export function CourseProgressCard({ completed, total, items }: Props) {
  return (
    <aside className="surface-panel-soft rounded-3xl p-5 lg:sticky lg:top-24">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Your Progress</h3>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {completed}/{total}
        </span>
      </header>

      <ul className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {items.map((it) => (
          <li key={it.id} className="flex items-center gap-3">
            <span
              className={cn(
                "w-6 h-6 rounded-full grid place-items-center shrink-0 border",
                it.done
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-transparent border-border text-transparent"
              )}
            >
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
            <span
              className={cn(
                "text-sm leading-snug truncate",
                it.done ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {it.title}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
