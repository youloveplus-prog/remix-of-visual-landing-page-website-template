import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DepartmentProps {
  name: string;
  number: string;
  dek?: string;
  children: ReactNode;
  className?: string;
}

/**
 * A "department" inside Spread 4. Editorial label + thin rule + body content.
 * Body is whatever existing carousel/component we want to host inside.
 */
export function Department({ name, number, dek, children, className }: DepartmentProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <header className="flex items-baseline gap-4">
        <span className="editorial-pagenum">{number}</span>
        <h3 className="editorial-eyebrow text-foreground text-xs lg:text-sm tracking-[0.28em]">
          {name}
        </h3>
        <div className="editorial-rule flex-1" />
      </header>
      {dek && (
        <p className="editorial-dek max-w-[60ch] -mt-2">{dek}</p>
      )}
      <div>{children}</div>
    </section>
  );
}
