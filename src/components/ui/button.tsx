import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Apple-calm button system.
 * - `default`  filled indigo, the single primary CTA per screen
 * - `secondary` white card + 1px border (the workhorse)
 * - `outline`  ghost border, transparent fill
 * - `ghost`    text only with subtle hover bg (for nav, tertiary actions)
 * - `link`     inline anchor styling
 * - `destructive` red filled
 * - `cta`      opt-in gradient — use sparingly for hero CTAs
 * - `glass`    floating chrome (sheets, FABs); avoid in body content
 */
const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        secondary:
          "bg-card text-foreground border border-border hover:bg-secondary hover:border-border shadow-sm",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary",
        ghost:
          "text-foreground hover:bg-secondary",
        link:
          "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        cta:
          "bg-brand-gradient text-primary-foreground shadow-md border border-primary/20 hover:shadow-lg hover:brightness-[1.04]",
        premium:
          "bg-brand-gradient text-primary-foreground shadow-md border border-primary/20 hover:shadow-lg hover:brightness-[1.04]",
        glass:
          "glass text-foreground hover:bg-[hsl(var(--glass-bg)/0.9)]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3.5 text-[13px]",
        lg: "h-13 rounded-xl px-7 text-[15px]",
        icon: "h-11 w-11",
        "icon-sm": "h-8 w-8",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
