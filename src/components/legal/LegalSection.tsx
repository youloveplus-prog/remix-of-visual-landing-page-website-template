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
        "scroll-mt-28 border-b border-border/50 pb-12 sm:pb-14 last:border-b-0",
        className
      )}
    >
      <div className="flex items-baseline gap-3 mb-5 sm:mb-6">
        <span className="text-sm font-medium text-muted-foreground/80 tabular-nums leading-none">
          {String(index).padStart(2, "0")}
        </span>
        <h2 className="font-display text-xl sm:text-[1.35rem] font-semibold tracking-tight text-foreground leading-tight">
          {title}
        </h2>
      </div>
      <div className="prose-legal">
        {children}
      </div>
    </section>
  );
};
