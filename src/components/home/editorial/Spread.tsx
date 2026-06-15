import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { RuleDraw, LabelRise } from "./motion-primitives";

interface SpreadProps {
  children: ReactNode;
  className?: string;
  pageNumber?: string; // e.g. "01" or "03"
  label?: string;
  rule?: boolean;
}

/**
 * Editorial spread wrapper.
 */
export function Spread({ children, className, label, rule = true }: SpreadProps) {
  return (
    <section
      className={cn(
        "relative px-5 sm:px-8 lg:px-12 max-w-[1400px] mx-auto w-full",
        className,
      )}
    >
      {rule && (
        <div className="flex items-center gap-3 sm:gap-4 mb-={children}
    </section>
  );
}
