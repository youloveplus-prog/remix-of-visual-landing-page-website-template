import { ReactNode } from "react";
import { HomeSection } from "./HomeSection";

interface DepartmentProps {
  name: string;
  number: string;
  dek?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Department — thin wrapper around HomeSection's `department` variant.
 * Kept as a named export so the editorial spreads keep their semantic naming.
 */
export function Department({ name, dek, children, className }: DepartmentProps) {
  return (
    <HomeSection
      variant="plain"
      title={name}
      dek={dek}
      className={className}
    >
      {children}
    </HomeSection>
  );
}
