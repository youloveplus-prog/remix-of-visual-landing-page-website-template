import { ReactNode, forwardRef, HTMLAttributes, useMemo } from "react";
import { cn } from "@/lib/utils";

type Variant = "glass" | "flat" | "outline" | "soft";

interface MobileCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  /** Removes inner padding for media-heavy cards. */
  noPadding?: boolean;
  /** Mount with a subtle fade-in. Optionally stagger by index. */
  animateIn?: boolean;
  /** When animateIn, used to stagger (capped to avoid long delays). */
  index?: number;
  /** Render a glass skeleton placeholder instead of children. */
  loading?: boolean;
  /** Disables hover lift + active press (use for non-interactive surfaces). */
  static?: boolean;
  children?: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  glass: "glass",
  flat: "bg-card border border-border/50",
  outline: "border border-border/70 bg-transparent",
  soft: "bg-secondary/40 border border-border/40",
};

/**
 * Mobile-app style card — single rounded-2xl surface with consistent padding,
 * tactile press feedback, optional mount animation, and built-in loading state.
 */
export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  (
    {
      variant = "glass",
      noPadding,
      animateIn,
      index = 0,
      loading,
      static: isStatic,
      className,
      children,
      style,
      ...rest
    },
    ref,
  ) => {
    const mergedStyle = useMemo(() => {
      if (!animateIn) return style;
      const delay = Math.min(index, 6) * 40;
      return { animationDelay: `${delay}ms`, ...style };
    }, [animateIn, index, style]);

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl min-w-0",
          variantClasses[variant],
          !isStatic && "pressable md:hover:shadow-md",
          !noPadding && "p-4",
          animateIn && "animate-fade-in opacity-0 [animation-fill-mode:forwards]",
          loading && "animate-pulse",
          className,
        )}
        style={mergedStyle}
        {...rest}
      >
        {loading ? (
          <div className="space-y-2">
            <div className="h-3 w-1/3 rounded bg-muted/60" />
            <div className="h-4 w-2/3 rounded bg-muted/60" />
            <div className="h-3 w-1/2 rounded bg-muted/40" />
          </div>
        ) : (
          children
        )}
      </div>
    );
  },
);
MobileCard.displayName = "MobileCard";
