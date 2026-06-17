import { forwardRef } from "react";
import {
  GraduationCap,
  BookOpen,
  Download,
  Sparkles,
  Package,
  Cpu,
  Users,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getProductCta, type ProductCtaIcon, type ProductLike } from "@/lib/productCta";

const ICON_MAP: Record<ProductCtaIcon, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  download: Download,
  sparkles: Sparkles,
  package: Package,
  cpu: Cpu,
  users: Users,
  "arrow-up-right": ArrowUpRight,
};

interface ProductCtaButtonProps extends Omit<ButtonProps, "children"> {
  product: ProductLike;
  /** True when the current user already owns this product. */
  owned?: boolean;
  /** Use the short label variant (good for cramped layouts). */
  short?: boolean;
  /** Hide the icon entirely. */
  hideIcon?: boolean;
  /** Override the resolved label (rare — prefer to fix the data). */
  labelOverride?: string;
}

/**
 * Renders a category-aware product CTA — "Enroll now" for courses,
 * "Read now" for books, "Download pack" for prompts, etc. Falls back to a
 * generic "Get access" when the product's category can't be determined.
 */
export const ProductCtaButton = forwardRef<HTMLButtonElement, ProductCtaButtonProps>(
  ({ product, owned, short, hideIcon, labelOverride, className, ...rest }, ref) => {
    const cta = getProductCta(product, { owned });
    const Icon = ICON_MAP[cta.icon] ?? ArrowUpRight;
    const label = labelOverride ?? (short ? cta.primaryShortLabel : cta.primaryLabel);

    return (
      <Button
        ref={ref}
        data-cta-kind={cta.kind}
        className={cn("font-semibold", className)}
        {...rest}
      >
        {!hideIcon && <Icon aria-hidden className="h-4 w-4 mr-2" />}
        {label}
      </Button>
    );
  },
);

ProductCtaButton.displayName = "ProductCtaButton";
