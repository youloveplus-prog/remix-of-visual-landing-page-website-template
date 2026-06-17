import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DepartmentProps {
  /** @deprecated kept for API compatibility; no longer rendered to avoid duplicate titles */
  name?: string;
  /** @deprecated kept for API compatibility; no longer rendered */
  number?: string;
  /** @deprecated kept for API compatibility; no longer rendered */
  dek?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Department — transparent wrapper. Inner sections own their titles, so the
 * department-level heading is intentionally not rendered to avoid duplicates.
 */
export function Department({ children, className, name }: DepartmentProps) {
  return (
    <div className={cn("w-full", className)} data-department-name={name}>
      {children}
    </div>
  );
}
