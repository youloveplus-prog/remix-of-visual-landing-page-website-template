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
          "relative grid place-items-center rounded-xl transition-all duration-300",
          "ring-1 ring-border/60 bg-card/70 backdrop-blur-xl",
          "group-hover:ring-primary/40 group-hover:shadow-[var(--shadow-glow)]",
          compact ? "h-9 w-9" : "h-10 w-10"
        )}
      >
        <img
          src={logo}
          alt=""
          className={cn("transition-all duration-300", compact ? "w-5 h-5" : "w-6 h-6")}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, hsl(var(--primary) / 0.18), transparent 70%)",
          }}
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
