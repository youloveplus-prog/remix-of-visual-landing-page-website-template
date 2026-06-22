import * as React from "react";

import { cn } from "@/lib/utils";

type CardVariant = "default" | "premium";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant.
   * - `default` — liquid-glass frosted surface (existing behavior).
   * - `premium` — adds a soft brand-gradient wash + brand-tinted border.
   *   Uses the `bg-brand-gradient-soft` theme token so it stays consistent
   *   across light and dark themes.
   */
  variant?: CardVariant;
}

/**
 * Liquid-glass Card.
 * Frosted surface with specular edges, refractive sheen, and primary-tinted hover.
 * Matches the About page treatment used across all pages.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "liquid-glass relative overflow-hidden rounded-2xl text-card-foreground transition-[box-shadow,border-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        variant === "premium" &&
          "border-premium-gradient bg-premium-gradient-soft shadow-premium",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Render the title with the `text-brand-gradient` theme token. */
  accent?: boolean;
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, accent = false, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-xl font-semibold leading-tight tracking-tight",
        accent && "text-brand-gradient",
        className,
      )}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
