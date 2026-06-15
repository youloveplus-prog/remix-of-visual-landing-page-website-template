import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SpreadProps {
  children: ReactNode;
  className?: string;
  pageNumber: string; // e.g. "01 / 05"
  label?: string;
  rule?: boolean;
}

/**
 * Editorial spread wrapper.
 * Provides consistent gutters, optional top rule + label, and a signed page number.
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
          <div className="editorial-rule flex-1" />
          {label && <span className="editorial-eyebrow shrink-0">{label}</span>}
          <div className="editorial-rule flex-1" />
        </div>
      )}
      {children}
      <div className="mt-8 lg:mt-14 flex items-center justify-between">
        <span className="editorial-pagenum">ASIKON / EDITION 06</span>
        <span className="editorial-pagenum">{pageNumber}</span>
      </div>
    </section>
  );
}
