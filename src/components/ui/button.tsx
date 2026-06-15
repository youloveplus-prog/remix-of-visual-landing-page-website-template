import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Bento-soft button system.
 * Drop-in compatible with the previous variants — `chip` is new, `xl` size is new,
 * and a `loading` prop renders a spinner inline.
 *
 * - `default`      filled indigo CTA, soft lifted shadow
 * - `secondary`    warm-cream tile with border
 * - `outline`      transparent fill, border only
 * - `ghost`        text only, subtle hover bg
 * - `link`         inline anchor styling
 * - `destructive`  red filled
 * - `cta` / `premium`  brand-gradient hero CTA (use sparingly)
 * - `glass`        floating chrome (overlays, FABs)
 * - `chip`         pill-shaped indigo tint (filters, meta tags)
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_2px_0_0_hsl(var(--primary)/0.25),0_8px_24px_-12px_hsl(var(--primary)/0.45)] hover:bg-primary/95 hover:-translate-y-[1px] hover:shadow-[0_3px_0_0_hsl(var(--primary)/0.25),0_12px_28px_-10px_hsl(var(--primary)/0.5)]",
        secondary:
          "bg-secondary text-secondary-foreground border border-border shadow-sm hover:bg-secondary/85 hover:-translate-y-[1px] hover:shadow-md",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted/60",
        ghost:
          "text-foreground hover:bg-muted/70",
        link:
          "text-primary underline-offset-4 hover:underline story-link",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-[1px] hover:shadow-md",
        cta:
          "bg-brand-gradient text-primary-foreground shadow-md border border-primary/20 hover:shadow-lg hover:-translate-y-[1px] hover:brightness-[1.04]",
        premium:
          "group/btn relative overflow-hidden bg-foreground text-background border border-foreground/15 shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.45)] hover:-translate-y-[1px] hover:shadow-[0_18px_40px_-14px_hsl(var(--foreground)/0.55)] before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_25%,hsl(var(--background)/0.22)_45%,transparent_65%)] before:translate-x-[-120%] before:transition-transform before:duration-[900ms] before:ease-out hover:before:translate-x-[120%] after:absolute after:inset-x-3 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-background/40 after:to-transparent",
        "premium-outline":
          "group/btn relative overflow-hidden border border-foreground/20 bg-background/60 backdrop-blur text-foreground hover:bg-background hover:border-foreground/45 hover:-translate-y-[1px] hover:shadow-[0_14px_36px_-18px_hsl(var(--foreground)/0.35)] before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent_25%,hsl(var(--foreground)/0.06)_45%,transparent_65%)] before:translate-x-[-120%] before:transition-transform before:duration-[900ms] before:ease-out hover:before:translate-x-[120%]",
        glass:
          "surface-panel backdrop-blur-md text-foreground hover:bg-muted/60",
        chip:
          "rounded-full bg-primary/10 text-foreground hover:bg-primary/15 px-3.5 py-1.5 text-xs font-medium",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-xl px-3.5 text-[13px]",
        lg: "h-12 rounded-2xl px-6 text-[15px]",
        xl: "h-14 rounded-2xl px-7 text-base font-semibold",
        icon: "h-11 w-11 px-0",
        "icon-sm": "h-9 w-9 px-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Renders a spinner before children, sets aria-busy, and disables interaction. */
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const classes = cn(buttonVariants({ variant, size, className }));

    // Slot/asChild path must receive a single child unchanged — skip motion/spinner wrappers.
    if (asChild) {
      return (
        <Slot className={classes} ref={ref} aria-busy={loading || undefined} {...props}>
          {children as React.ReactElement}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        whileTap={isDisabled ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.4 }}
        {...(props as unknown as React.ComponentProps<typeof motion.button>)}
      >
        {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
