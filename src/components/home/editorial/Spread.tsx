import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SpreadProps {
  children: ReactNode;
  className?: string;
  /** @deprecated kept for API compatibility; no longer rendered */
  label?: string;
  /** @deprecated kept for API compatibility; no longer rendered */
  rule?: boolean;
}

/**
 * Section wrapper — clean container with no magazine label bar.
 */
export function Spread({ children, className }: SpreadProps) {
  return (
    <section
      className={cn(
        "relative px-3 sm:px-6 lg:px-12 max-w-[1400px] mx-auto w-full",
        className,
      )}
    >
      {children}
    </section>
  );
}
