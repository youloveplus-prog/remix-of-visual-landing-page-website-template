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
      <header className="flex items-center gap-3">
        <span aria-hidden className="block h-px w-6 bg-foreground/30" />
        <span className="editorial-pagenum">{number}</span>
        <h3 className="editorial-eyebrow text-foreground tracking-[0.2em]">
          {name}
        </h3>
      </header>
      {dek && (
        <Reveal delay={120}>
          <p className="editorial-dek max-w-[52ch]">{dek}</p>
        </Reveal>
      )}
      <Reveal delay={180}>
        <div>{children}</div>
      </Reveal>
    </Reveal>
  );
}
