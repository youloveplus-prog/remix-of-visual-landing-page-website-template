import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useInViewOnce } from "@/hooks/useInViewOnce";

interface SpreadProps {
  children: ReactNode;
  className?: string;
  pageNumber: string; // e.g. "01 / 05"
  label?: string;
  rule?: boolean;
}

/**
 * Editorial spread wrapper.
 * On scroll-in: top hairline draws left-to-right, label rises, page number fades.
 * Respects prefers-reduced-motion (collapses to final state instantly).
 */
export function Spread({ children, className, pageNumber, label, rule = true }: SpreadProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const state = inView ? "is-in" : "";

  return (
    <section
      ref={ref}
      className={cn(
        "relative px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full",
        className,
      )}
    >
      {rule && (
        <div className="flex items-center gap-4 mb-6 lg:mb-10">
          <div className={cn("editorial-rule editorial-rule-draw flex-1", state)} />
          {label && (
            <span className={cn("editorial-eyebrow editorial-label-rise shrink-0", state)}>
              {label}
            </span>
          )}
          <div className={cn("editorial-rule editorial-rule-draw flex-1", state)} />
        </div>
      )}
      {children}
      <div className="mt-8 lg:mt-14 flex items-center justify-between">
        <span className={cn("editorial-pagenum editorial-pagenum-rise", state)}>
          ASIKON / EDITION 06
        </span>
        <span className={cn("editorial-pagenum editorial-pagenum-rise", state)}>
          {pageNumber}
        </span>
      </div>
    </section>
  );
}
