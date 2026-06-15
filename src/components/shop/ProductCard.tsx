import { Heart, Star, ArrowUpRight, TrendingUp, Shield, Zap, BadgeCheck, Users } from "lucide-react";
import { useState, forwardRef, memo } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { Price } from "@/lib/currency";
import { ProductQuickView } from "./ProductQuickView";

const CTA_BY_KIND: Record<NonNullable<Product["kind"]>, { full: string; short: string }> = {
  course: { full: "Enroll", short: "Enroll" },
  ebook: { full: "Buy Now", short: "Buy" },
  service: { full: "Book Now", short: "Book" },
  bundle: { full: "Get Bundle", short: "Get" },
};

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
}

/**
 * Universal product card — "Style A" layout.
 * - Image fills the top with rounded corners, price chip floats top-right.
 * - Tonal strip across the bottom of the image carries an instant-access trust line
 *   (digital-only product — never use shipping/delivery copy).
 * - Title row pairs with an "Order Now ↗" affordance.
 * - Tag chips sit underneath for quick scanability.
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

    // Tag chips — derive from product fields without changing the data shape.
    const chips: string[] = [
      ...(Array.isArray((product as any).tags) ? ((product as any).tags as string[]) : []),
      ...((product as any).category ? [String((product as any).category)] : []),
    ]
      .filter(Boolean)
      .slice(0, isCompact ? 2 : 3);

    return (
      <>
        <article
          ref={ref}
          className={cn(
            "group relative bg-card rounded-2xl md:rounded-3xl overflow-hidden border border-border/60 h-full flex flex-col",
            "transition-[transform,box-shadow,border-color] duration-300",
            "shadow-[0_2px_10px_-2px_hsl(var(--foreground)/0.06)]",
            "hover:shadow-[0_20px_25px_-5px_hsl(var(--foreground)/0.1)] hover:-translate-y-1 hover:border-primary/30",
            "active:scale-[0.97] p-1.5 md:p-2",
            isFeatured && "lg:flex-row lg:p-3"
          )}
        >
          {/* Image block — rounded inside the card, with floating price chip + bottom strip */}
          <figure
            className={cn(
              "relative overflow-hidden rounded-xl md:rounded-2xl bg-secondary/40",
              isCompact ? "aspect-square" : "aspect-[4/3]",
              isFeatured && "lg:w-1/2 lg:aspect-auto lg:self-stretch"
            )}
          >
            <SmartImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Floating price chip — top-right, sits on image like Style A */}
            <div className="absolute top-0 right-0 bg-card rounded-bl-2xl pl-2.5 pb-1.5 md:pl-3 md:pb-2">
              <div className="flex items-baseline gap-1">
                <Price
                  amount={product.price}
                  className={cn(
                    "font-display font-bold text-foreground tracking-tight leading-none",
                    isCompact ? "text-sm md:text-base" : "text-base md:text-lg",
                    isFeatured && "lg:text-xl"
                  )}
                />
                {product.originalPrice && (
                  <Price
                    amount={product.originalPrice}
                    strike
                    className="text-[10px] text-muted-foreground"
                  />
                )}
              </div>
            </div>

            {/* Wishlist — moved to top-left to free the price corner */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "no-min-tap absolute top-2 left-2 md:top-3 md:left-3 h-8 w-8 grid place-items-center rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm",
                isWishlisted
                  ? "bg-primary/15 ring-1 ring-primary/40"
                  : "bg-background/90 hover:bg-background"
              )}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"
                )}
              />
            </button>

            {/* Status badges — stacked below wishlist, capped */}
            <div className="absolute top-12 left-2 md:left-3 flex flex-col gap-1 max-w-[60%]">
              {discount > 0 && (
                <Badge className="text-[10px] font-bold bg-primary text-primary-foreground border-0 px-2 py-0.5 rounded-full tracking-wider uppercase shadow-md">
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

            {/* Trust strip — bottom of image, replaces "Free Delivery" with instant-access copy */}
            <div className="absolute inset-x-0 bottom-0 bg-primary/85 backdrop-blur-sm text-primary-foreground">
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

            {/* Title + Order Now */}
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  "font-display font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors min-w-0 flex-1",
                  isCompact ? "text-sm md:text-base" : "text-sm md:text-lg",
                  isFeatured && "lg:text-2xl lg:line-clamp-3"
                )}
              >
                {product.name}
              </h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
                className="shrink-0 inline-flex items-center gap-0.5 text-[11px] md:text-xs font-semibold text-foreground/90 hover:text-primary underline underline-offset-2 decoration-foreground/40 hover:decoration-primary transition-colors no-min-tap"
                aria-label={`${product.kind ? CTA_BY_KIND[product.kind].full : "Order"} ${product.name}`}
              >
                <span className="hidden sm:inline">
                  {product.kind ? CTA_BY_KIND[product.kind].full : "Order Now"}
                </span>
                <span className="sm:hidden">
                  {product.kind ? CTA_BY_KIND[product.kind].short : "Order"}
                </span>
                <ArrowUpRight className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </button>
            </div>

            {/* Creator trust + social proof row */}
            {(product.instructorVerified || (product.kind === "course" && product.enrollmentCount)) && (
              <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-muted-foreground">
                {product.instructorVerified && (
                  <span className="inline-flex items-center gap-1 text-primary font-medium">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </span>
                )}
                {product.kind === "course" && !!product.enrollmentCount && (
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {product.enrollmentCount.toLocaleString()} enrolled
                  </span>
                )}
              </div>
            )}

            {/* Tag chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 md:gap-1.5">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="text-[9px] md:text-[10px] font-medium text-muted-foreground bg-secondary/70 rounded-full px-2 py-0.5 line-clamp-1 max-w-full"
                  >
                    {c}
                  </span>
                ))}
                {product.rating > 0 && (
                  <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] md:text-[11px] font-medium text-muted-foreground">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {product.rating}
                  </span>
                )}
              </div>
            )}

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
