import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/transitions/Reveal";

interface DepartmentProps {
  name: string;
  number: string;
  dek?: string;
  children: ReactNode;
  className?: string;
}

export function Department({ name, number, dek, children, className }: DepartmentProps) {
  return (
    <Reveal as="section" className={cn("space-y-5 sm:space-y-6", className)} variant="fade-up">
      <header className="flex items-baseline gap-3 sm:gap-4">
        <span className="editorial-pagenum">{number}</span>
        <h3 className="editorial-eyebrow text-foreground text-[0.6875rem] sm:text-xs lg:text-sm tracking-[0.24em] sm:tracking-[0.28em]">
          {name}
        </h3>
        <div className="editorial-rule flex-1" />
      </header>
      {dek && (
        <Reveal delay={120}>
          <p className="editorial-dek max-w-[60ch] -mt-1 sm:-mt-2">{dek}</p>
        </Reveal>
      )}
      <Reveal delay={180}>
        <div>{children}</div>
      </Reveal>
    </Reveal>
  );
}
