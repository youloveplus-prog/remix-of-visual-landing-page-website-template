import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LegalSectionProps {
  index: number;
  title: string;
  children: ReactNode;
  className?: string;
}

export const LegalSection = ({
  index,
  title,
  children,
  className,
}: LegalSectionProps) => {
  return (
    <section
      id={`section-${index}`}
      className={cn(
        "scroll-mt-28 border-b border-border/60 pb-10 last:border-b-0",
        className
      )}
    >
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-sm font-medium text-muted-foreground tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      <div className="prose-legal text-foreground/80 leading-relaxed">
        {children}
      </div>
    </section>
  );
};
