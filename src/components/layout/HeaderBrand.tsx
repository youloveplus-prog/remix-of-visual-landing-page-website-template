import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

interface HeaderBrandProps {
  compact?: boolean;
  /** Hide the wordmark — useful in tight headers */
  iconOnly?: boolean;
  className?: string;
}

/**
 * Shared brand lockup for every desktop header.
 * Keeps the left edge anchored even when the mega menu collapses.
 */
export function HeaderBrand({ compact = false, iconOnly = false, className }: HeaderBrandProps) {
  return (
    <Link
      to="/"
      aria-label="Asikon — Home"
      className={cn("group flex-shrink-0 flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "relative grid place-items-center transition-all duration-300",
          compact ? "h-9 w-9" : "h-10 w-10"
        )}
      >
        <img
          src={logo}
          alt=""
          className={cn(
            "transition-all duration-300 object-contain drop-shadow-[0_2px_6px_hsl(var(--primary)/0.25)]",
            compact ? "w-7 h-7" : "w-8 h-8"
          )}
        />
      </span>
      {!iconOnly && (
        <h1
          className={cn(
            "font-display font-bold text-gradient leading-none tracking-tight transition-all duration-300 hidden sm:block",
            compact ? "text-lg" : "text-xl"
          )}
        >
          Asikon
        </h1>
      )}
    </Link>
  );
}
