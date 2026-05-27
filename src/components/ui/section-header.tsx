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
    <div className={cn("flex items-end justify-between gap-3 mb-2", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground truncate">
          {title}
        </h2>
        {subtitle && (
          <p className="hidden sm:block text-[12px] text-muted-foreground/80 mt-1 line-clamp-1 normal-case tracking-normal">
            {subtitle}
          </p>
        )}
      </div>
      {viewAllHref && (
        <Link
          to={viewAllHref}
          className="group/va shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors focus-ring rounded-md px-1 -mx-1"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/va:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
