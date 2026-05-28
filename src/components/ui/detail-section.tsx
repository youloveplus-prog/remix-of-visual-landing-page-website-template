import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DetailSectionProps {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Add hairline top divider (use to separate stacked sections). */
  divided?: boolean;
}

/**
 * Flat content section with optional hairline divider and consistent vertical rhythm.
 * Native-app minimal — no cards, no nested glass.
 */
export function DetailSection({ title, action, children, className, divided = true }: DetailSectionProps) {
  return (
    <section
      className={cn(
        "space-y-4",
        divided && "pt-6 border-t border-border/40 first:pt-0 first:border-t-0",
        className,
      )}
    >
      {(title || action) && (
        <div className="flex items-baseline justify-between gap-3">
          {title && (
            <h2 className="font-display text-[17px] lg:text-[20px] font-semibold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
