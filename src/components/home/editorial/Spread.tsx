import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { RuleDraw, LabelRise, PageNumRise } from "./motion-primitives";

interface SpreadProps {
  children: ReactNode;
  className?: string;
  pageNumber: string; // e.g. "01" or "03"
  label?: string;
  rule?: boolean;
}

/**
 * Editorial spread wrapper. Quiet, single-folio version.
 */
export function Spread({ children, className, pageNumber, label, rule = true }: SpreadProps) {
  return (
    <section
      className={cn(
        "relative px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto w-full",
        className,
      )}
    >
      {rule && (
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
          <RuleDraw className="flex-1" />
          {label && <LabelRise className="shrink-0">{label}</LabelRise>}
          <RuleDraw className="flex-1" />
        </div>
      )}
      {children}
      <div className="mt-8 sm:mt-10 lg:mt-14 flex items-center justify-end">
        <PageNumRise>— {pageNumber}</PageNumRise>
      </div>
    </section>
  );
}
