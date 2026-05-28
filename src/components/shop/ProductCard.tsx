import { Heart, Star, ShoppingBag, Eye, TrendingUp, Shield } from "lucide-react";
import { useState, forwardRef, memo } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { Price } from "@/lib/currency";
import { ProductQuickView } from "./ProductQuickView";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
}

/**
 * Universal product card.
 * - Mobile-app feel: rounded-2xl, hairline border, active:scale tap feedback.
 * - Hover overlay only shows on devices with hover (md+/desktop).
 * - Brand chip is hidden when it equals the default store brand to save space.
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

    return (
      <>
        <article
          ref={ref}
          className={cn(
            "group relative bg-card rounded-xl md:rounded-2xl overflow-hidden border border-border/60 h-full flex flex-col",
            "transition-[transform,box-shadow,border-color] duration-300",
            "shadow-[0_2px_10px_-2px_hsl(var(--foreground)/0.06)]",
            "hover:shadow-[0_20px_25px_-5px_hsl(var(--foreground)/0.1)] hover:-translate-y-1 hover:border-primary/30",
            "active:scale-[0.97]",
            isFeatured && "lg:flex-row"
          )}
        >
          {/* Image — taller 4:3 thumbnail */}
          <figure
            className={cn(
              "relative overflow-hidden bg-secondary/30",
              isCompact ? "aspect-square" : "aspect-[4/3]",
              isFeatured && "lg:w-1/2 lg:aspect-auto lg:h-full"
            )}
          >
            <SmartImage
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Duration badge — YouTube style bottom-right */}
            {(product as any).duration && (
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-medium px-1.5 py-0.5 rounded">
                {(product as any).duration}
              </span>
            )}

            {/* Wishlist */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "no-min-tap absolute top-2 right-2 md:top-3 md:right-3 h-8 w-8 md:h-9 md:w-9 grid place-items-center rounded-full transition-all duration-200 backdrop-blur-sm shadow-sm",
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

            {/* Badge stack — capped at 2, calm tonal styling */}
            <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 max-w-[60%]">
              {discount > 0 && (
                <Badge className="text-[10px] md:text-[11px] font-bold bg-primary text-primary-foreground border-0 px-2.5 py-1 rounded-full tracking-wider uppercase shadow-md">
                  −{discount}%
                </Badge>
              )}
              {product.isTrending && discount === 0 && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-[10px] font-medium bg-background/90 backdrop-blur-sm border-0 px-2 py-0.5 rounded-full"
                >
                  <TrendingUp className="h-2.5 w-2.5 text-primary" />
                  Trending
                </Badge>
              )}
              {product.isNew && discount === 0 && !product.isTrending && (
                <Badge
                  variant="secondary"
                  className="text-[10px] font-medium bg-background/90 backdrop-blur-sm border-0 px-2 py-0.5 rounded-full"
                >
                  New
                </Badge>
              )}
              {product.isAuthentic && (
                <Badge
                  variant="secondary"
                  className="gap-1 text-[10px] font-medium bg-background/90 backdrop-blur-sm border-0 px-2 py-0.5 rounded-full"
                >
                  <Shield className="h-2.5 w-2.5 text-success" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Hover actions — desktop only */}
            <div
              className={cn(
                "hidden md:flex absolute bottom-3 left-3 right-3 gap-2 transition-all duration-300",
                "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
              )}
            >
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 h-9 bg-background/95 backdrop-blur-md hover:bg-background text-xs font-medium rounded-xl"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                Quick view
              </Button>
              <Button
                size="sm"
                className="h-9 w-9 p-0 rounded-xl"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowQuickView(true);
                }}
                aria-label="Add to cart"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
              </Button>
            </div>
          </figure>

          {/* Content */}
          <div
            className={cn(
              "p-3 md:p-5 flex-1 flex flex-col",
              isFeatured && "lg:flex-1 lg:justify-center lg:p-6"
            )}
          >
            {showBrand && (
              <p className="eyebrow text-primary/80 mb-1.5 line-clamp-1">{product.brand}</p>
            )}

            <h3
              className={cn(
                "font-display font-bold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-2 md:mb-3",
                isCompact ? "text-sm md:text-base min-h-[2rem] md:min-h-[2.5rem]" : "text-sm md:text-xl min-h-[2.5rem] md:min-h-[3rem]",
                isFeatured && "lg:text-2xl lg:line-clamp-3 lg:min-h-0"
              )}
            >
              {product.name}
            </h3>

            <div className="mt-auto flex flex-col gap-2">
              <div className="flex items-baseline gap-2 min-w-0">
                <Price
                  amount={product.price}
                  className={cn(
                    "font-bold text-primary tracking-tight",
                    isCompact ? "text-sm md:text-base" : "text-base md:text-lg",
                    isFeatured && "lg:text-2xl"
                  )}
                />
                {product.originalPrice && (
                  <Price
                    amount={product.originalPrice}
                    strike
                    className="text-sm text-muted-foreground"
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                {product.rating > 0 ? (
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {product.rating}
                    </span>
                  </div>
                ) : <span />}
                {product.brand && (
                  <span className="text-[10px] md:text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-widest line-clamp-1">
                    {showBrand ? "" : product.brand}
                  </span>
                )}
              </div>
            </div>

            {isFeatured && (
              <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
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
