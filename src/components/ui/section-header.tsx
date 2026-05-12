import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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
 * Consistent section header used across Home, Shop, Community, Profile.
 * Provides predictable typography rhythm and a "see all" affordance.
 */
export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "See all",
  className,
  eyebrow,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-3 mb-3", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80 mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="text-base sm:text-lg font-semibold tracking-tight truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="shrink-0 inline-flex items-center gap-0.5 text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-ring rounded-md px-1 -mx-1"
        >
          {viewAllLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
