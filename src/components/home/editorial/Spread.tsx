import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { RuleDraw, LabelRise, PageNumRise } from "./motion-primitives";

interface SpreadProps {
  children: ReactNode;
  className?: string;
  pageNumber: string; // e.g. "01 / 05"
  label?: string;
  rule?: boolean;
}

/**
 * Editorial spread wrapper. All entrance choreography is delegated to
 * shared motion primitives so every spread shares timing + reduced-motion
 * behavior.
 */
export function Spread({ children, className, pageNumber, label, rule = true }: SpreadProps) {
  return (
    <section
      className={cn(
        "relative px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full",
        className,
      )}
    >
      {rule && (
        <div className="flex items-center gap-4 mb-6 lg:mb-10">
          <RuleDraw className="flex-1" />
          {label && <LabelRise className="shrink-0">{label}</LabelRise>}
          <RuleDraw className="flex-1" />
        </div>
      )}
      {children}
      <div className="mt-8 lg:mt-14 flex items-center justify-between">
        <PageNumRise>ASIKON / EDITION 06</PageNumRise>
        <PageNumRise>{pageNumber}</PageNumRise>
      </div>
    </section>
  );
}
