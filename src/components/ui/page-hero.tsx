import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

/**
 * Shared page hero block — native-app minimal.
 * Tight type, generous spacing, no decorative containers.
 */
export function PageHero({ eyebrow, title, subtitle, meta, actions, className }: PageHeroProps) {
  return (
    <header className={cn("space-y-3", className)}>
      {eyebrow && (
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h1 className="font-display text-[28px] leading-[1.1] lg:text-[40px] lg:leading-[1.05] font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[14px] lg:text-base text-muted-foreground max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      {meta && <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted-foreground">{meta}</div>}
      {actions && <div className="flex flex-wrap items-center gap-2 pt-1">{actions}</div>}
    </header>
  );
}
