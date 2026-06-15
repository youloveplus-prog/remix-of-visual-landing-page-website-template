import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLegalPresenceContext } from "@/components/legal/LegalPresenceContext";
import { Eye } from "lucide-react";

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
  const { counts } = useLegalPresenceContext();
  const live = counts[index] ?? 0;

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
        {live > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary tabular-nums whitespace-nowrap"
            aria-live="polite"
            title={`${live} reading this section now`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <Eye className="h-3 w-3" />
            {live}
          </span>
        )}
      </div>
      <div className="prose-legal">
        {children}
      </div>
    </section>
  );
};
