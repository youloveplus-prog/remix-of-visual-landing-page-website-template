import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { RuleDraw, LabelRise } from "./motion-primitives";

interface SpreadProps {
  children: ReactNode;
  className?: string;
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
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 lg:mb-10">
          <RuleDraw className="flex-1" />
          {label && <LabelRise className="shrink-0">{label}</LabelRise>}
          <RuleDraw className="flex-1" />
        </div>
      )}
      {children}
    </section>
  );
}
