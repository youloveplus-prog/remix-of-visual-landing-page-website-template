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
  /**
   * Render the title with the theme-aware brand gradient (`text-brand-gradient`).
   * Defaults to `true` so editorial headers across the app share a consistent
   * premium look in both light and dark modes. Set to `false` to opt out for
   * dense surfaces where a flat title reads better.
   */
  accent?: boolean;
}

/**
 * Editorial section header — gradient display title, optional eyebrow kicker,
 * and an animated "View all →" link. The gradient is sourced from the
 * `text-brand-gradient` theme token so it swaps automatically with the theme.
 */
export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  className,
  eyebrow,
  accent = true,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-3 mb-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "font-display font-bold leading-[0.95] tracking-[-0.035em] text-[26px] sm:text-[34px] lg:text-[40px]",
            accent ? "text-brand-gradient" : "text-foreground",
          )}
        >
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
          className="group/va shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md px-1 -mx-1 mb-1"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/va:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
