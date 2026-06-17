import {
  Heart,
  Star,
  ArrowUpRight,
  TrendingUp,
  Shield,
  Zap,
  BadgeCheck,
  Users,
  GraduationCap,
  BookOpen,
  Download,
  Sparkles,
  Package,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import { useState, forwardRef, memo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { Price } from "@/lib/currency";
import { ProductQuickView } from "./ProductQuickView";
import { getProductCta, type ProductCtaIcon } from "@/lib/productCta";
import { logProductClick } from "@/lib/productAnalytics";
import { useProductImpression } from "@/hooks/useProductImpression";

const ICON_BY_NAME: Record<ProductCtaIcon, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  download: Download,
  sparkles: Sparkles,
  package: Package,
  cpu: Cpu,
  users: Users,
  "arrow-up-right": ArrowUpRight,
};

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
}

/**
 * Universal product card — refined "Style A" layout.
 * - Image well sits inside an inset ring with a soft top-down overlay
 * - Floating price pill anchored bottom-left of the image
 * - Trust strip slides up on hover (idle = clean image)
 * - Title row pairs with a primary-tinted arrow CTA that fills on hover
 * - Brand-tinted hover shadow + calmer lift
 */
const DEFAULT_BRAND = "Asikon Academy";

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, variant = "default" }, ref) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);

    const discount = product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;

    const isCompact = variant === "compact";
    const isFeatured = variant === "featured";
    const showBrand = product.brand && product.brand !== DEFAULT_BRAND;

    // Distinct image silhouettes per content type:
    //  - course → 16:9 cinematic (feels like video / lesson thumb)
    //  - service → 4:3 classic deliverable card
    //  - ebook / bundle / product → 1:1 square e-commerce tile
    // Compact and featured variants still override (used by carousels / hero).
    const aspectByKind =
      product.kind === "course"
        ? "aspect-video"
        : product.kind === "service"
          ? "aspect-[4/3]"
          : "aspect-square";

    // Tag chips — derive from product fields without changing the data shape.
    const chips: string[] = [
      ...(Array.isArray((product as any).tags) ? ((product as any).tags as string[]) : []),
      ...((product as any).category ? [String((product as any).category)] : []),
    ]
      .filter(Boolean)
      .slice(0, isCompact ? 2 : 3);

    const cta = getProductCta(product);
    const CtaIcon = ICON_BY_NAME[cta.icon] ?? ArrowUpRight;
    const ctaFull = cta.primaryLabel;
    const ctaShort = cta.primaryShortLabel;

    const detailHref = `/product/${(product as any).slug || `product-${product.id}`}`;

    const { elementRef: impressionRef, stateRef: impressionState } =
      useProductImpression<HTMLDivElement>({
        id: product.id,
        name: product.name,
        price: product.price,
        slug: (product as any).slug,
      });

    return (
      <>
        <Link
          to={detailHref}
          onClick={() => {
            const s = impressionState.current;
            logProductClick({
              productId: String(product.id),
              productSlug: (product as any).slug || `product-${product.id}`,
              productName: product.name,
              price: product.price,
              maxVisibility: Number(s.maxVisibility.toFixed(2)),
              dwellMs: Math.round(
                s.dwellMs +
                  (s.visibleSince != null
                    ? performance.now() - s.visibleSince
                    : 0),
              ),
            });
          }}
          aria-label={`View ${product.name}`}
          className="block h-full no-underline focus:outline-none rounded-2xl md:rounded-3xl"
        >
        <article
          ref={(node) => {
            impressionRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className={cn(
            "group relative bg-card rounded-2xl md:rounded-3xl overflow-hidden border border-border/60 h-full flex flex-col",
            "transition-[transform,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none",
            "shadow-[0_2px_10px_-2px_hsl(var(--foreground)/0.05)]",
            "hover:border-primary/40 hover:shadow-[0_14px_36px_-14px_hsl(var(--primary)/0.28)]",
            "motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]",
            "focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-background",
            "p-1.5 md:p-2",
            isFeatured && "lg:flex-row lg:p-3"
          )}
        >
          {/* Image well — inset ring + soft overlay for depth */}
          <figure
            className={cn(
              "relative overflow-hidden rounded-xl md:rounded-2xl bg-secondary/40 ring-1 ring-inset ring-border/60",
              isCompact ? "aspect-square" : aspectByKind,
              isFeatured && "lg:w-1/2 lg:aspect-auto lg:self-stretch"
            )}
          >
            <SmartImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-[600ms] ease-out motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none"
            />

            {/* Soft top-down overlay to seat the image */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/5 via-transparent to-foreground/10"
            />

            {/* Wishlist — top-right */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isWishlisted}
              className={cn(
                "no-min-tap absolute top-2 right-2 md:top-2.5 md:right-2.5 h-9 w-9 grid place-items-center rounded-full transition-all duration-200 backdrop-blur-md shadow-sm motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                isWishlisted
                  ? "bg-primary/15 ring-1 ring-primary/40"
                  : "bg-background/85 hover:bg-background"
              )}
            >
              <Heart
                aria-hidden="true"
                className={cn(
                  "h-4 w-4 transition-colors",
                  isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"
                )}
              />
            </button>

            {/* Status badges — top-left, single column */}
            <div className="absolute top-2 left-2 md:top-2.5 md:left-2.5 flex flex-col gap-1 max-w-[60%]">
              {discount > 0 && (
                <Badge className="text-[10px] font-bold border-0 px-2 py-0.5 rounded-full tracking-wider uppercase shadow-md text-primary-foreground bg-gradient-to-r from-primary to-primary/80">
                  −{discount}%
                </Badge>
              )}
              {product.isTrending && discount === 0 && (
                <Badge variant="secondary" className="gap-1 text-[10px] font-medium bg-background/90 backdrop-blur-sm border-0 px-2 py-0.5 rounded-full">
                  <TrendingUp className="h-2.5 w-2.5 text-primary" /> Trending
                </Badge>
              )}
              {product.isNew && discount === 0 && !product.isTrending && (
                <Badge variant="secondary" className="text-[10px] font-medium bg-background/90 backdrop-blur-sm border-0 px-2 py-0.5 rounded-full">
                  New
                </Badge>
              )}
            </div>


            {/* Trust strip — slides up on hover, idle = clean image */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-300 ease-out motion-reduce:transition-none",
                "group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100",
                "bg-gradient-to-r from-foreground/90 to-foreground/80 backdrop-blur-sm text-background"
              )}
            >
              <div className="flex items-center justify-center gap-1.5 px-2 py-1 md:py-1.5">
                <Zap className="h-3 w-3 fill-current" />
                <span className="text-[10px] md:text-[11px] font-medium tracking-wide truncate">
                  Instant access · Lifetime
                </span>
              </div>
            </div>
          </figure>

          {/* Content */}
          <div
            className={cn(
              "px-2 pt-2.5 pb-2 md:px-3 md:pt-3 md:pb-2.5 flex-1 flex flex-col gap-2",
              isFeatured && "lg:flex-1 lg:justify-center lg:p-6"
            )}
          >
            {showBrand && (
              <p className="eyebrow text-primary/80 line-clamp-1 -mb-1">{product.brand}</p>
            )}

            {/* Title */}
            <h3
              className={cn(
                "font-display font-bold text-foreground leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors",
                isCompact ? "text-sm md:text-base" : "text-sm md:text-[17px]",
                isFeatured && "lg:text-2xl lg:line-clamp-3"
              )}
            >
              {product.name}
            </h3>

            {/* Price row — wraps gracefully on narrow cards; discount % already shown on image */}
            <div className="flex items-baseline gap-x-1.5 gap-y-0.5 flex-wrap min-w-0">
              <Price
                amount={product.price}
                className={cn(
                  "font-display font-bold text-foreground tracking-tight leading-none whitespace-nowrap",
                  isCompact ? "text-sm md:text-base" : "text-[15px] md:text-lg",
                  isFeatured && "lg:text-xl"
                )}
              />
              {product.originalPrice && (
                <Price
                  amount={product.originalPrice}
                  strike
                  className="text-[11px] md:text-xs text-muted-foreground whitespace-nowrap leading-none"
                />
              )}
              {/* Save % is intentionally omitted here — the image already shows a −X% badge */}
            </div>

            {/* Consolidated meta row — verified · enrolled · rating */}
            {(product.instructorVerified || (product.kind === "course" && product.enrollmentCount) || product.rating > 0) && (
              <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-muted-foreground flex-wrap">
                {product.instructorVerified && (
                  <span className="inline-flex items-center gap-1 text-primary font-medium">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                )}
                {product.instructorVerified && (product.kind === "course" && !!product.enrollmentCount) && (
                  <span aria-hidden className="text-border">•</span>
                )}
                {product.kind === "course" && !!product.enrollmentCount && (
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {product.enrollmentCount.toLocaleString()}
                  </span>
                )}
                {((product.instructorVerified || (product.kind === "course" && !!product.enrollmentCount)) && product.rating > 0) && (
                  <span aria-hidden className="text-border">•</span>
                )}
                {product.rating > 0 && (
                  <span className="inline-flex items-center gap-0.5 font-medium">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </span>
                )}
              </div>
            )}

            {/* Tag chips + CTA arrow */}
            <div className="mt-auto flex items-end justify-between gap-2">
              {chips.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1 md:gap-1.5 min-w-0">
                  {chips.map((c) => (
                    <span
                      key={c}
                      className="text-[9px] md:text-[10px] font-medium text-muted-foreground bg-secondary/70 rounded-full px-2 py-0.5 line-clamp-1 max-w-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
                aria-label={`${ctaFull} ${product.name}`}
                aria-haspopup="dialog"
                className={cn(
                  "shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 min-h-9 text-[11px] md:text-xs font-semibold no-min-tap",
                  "border border-border bg-background text-foreground",
                  "transition-all duration-200 motion-reduce:transition-none",
                  "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary",
                  "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                )}
              >
                <span className="hidden sm:inline-flex items-center gap-1">
                  <CtaIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  {ctaFull}
                </span>
                <span className="sm:hidden inline-flex items-center gap-1">
                  <CtaIcon aria-hidden="true" className="h-3.5 w-3.5" />
                  {ctaShort}
                </span>
                <ArrowUpRight aria-hidden="true" className="h-3 w-3 md:h-3.5 md:w-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5 motion-reduce:transition-none" />
              </button>
            </div>

            {isFeatured && (
              <div className="flex flex-wrap items-center gap-3 mt-2 pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5 text-success" />
                  <span>Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  <span>Bestseller</span>
                </div>
              </div>
            )}
          </div>
        </article>
        </Link>

        <ProductQuickView
          product={product}
          open={showQuickView}
          onOpenChange={setShowQuickView}
        />
      </>
    );
  }
);

ProductCard.displayName = "ProductCard";
// Memoize: home/shop grids re-render often as filters change; product objects are stable by id.
const ProductCardMemo = memo(ProductCard, (a, b) =>
  a.variant === b.variant &&
  a.product.id === b.product.id &&
  a.product.price === b.product.price &&
  a.product.image === b.product.image,
);
(ProductCardMemo as any).displayName = "ProductCardMemo";
export { ProductCardMemo };
