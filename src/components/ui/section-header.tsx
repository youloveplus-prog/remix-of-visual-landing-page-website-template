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
    <div className={cn("flex items-end justify-between gap-3 mb-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-1.5">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display font-bold text-foreground leading-[0.95] tracking-[-0.035em] text-[26px] sm:text-[34px] lg:text-[40px]">
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
