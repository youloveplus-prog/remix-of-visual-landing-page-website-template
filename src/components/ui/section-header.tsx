import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  eyebrow?: string;
}

/**
 * Editorial section header — left accent bar (gradient), display font title,
 * optional eyebrow kicker, and an animated "View all →" link.
 */
export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  className,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-3 mb-5 lg:mb-7", className)}>
      <div className="min-w-0 space-y-1.5 lg:space-y-2">
        <p className="hidden lg:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground/70">
          <span className="h-px w-6 bg-border" />
          {eyebrow ?? "Explore"}
        </p>
        {eyebrow && (
          <p className="lg:hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display font-extrabold text-foreground leading-[0.92] tracking-[-0.04em] text-[26px] sm:text-[34px] lg:text-[44px] xl:text-[52px] lg:uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[12px] sm:text-sm text-muted-foreground mt-1.5 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="group/va shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-full lg:rounded-full lg:border lg:border-border/60 lg:px-4 lg:py-2 lg:hover:border-foreground/40 mb-1"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/va:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
