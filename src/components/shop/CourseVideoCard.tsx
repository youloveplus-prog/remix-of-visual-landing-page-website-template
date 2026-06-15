import { Heart, BadgeCheck } from "lucide-react";
import { forwardRef, memo, useState } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { SmartImage } from "@/components/ui/smart-image";
import { Price } from "@/lib/currency";

interface CourseVideoCardProps {
  product: Product;
}

const DEFAULT_BRAND = "Asikon Academy";

/**
 * YouTube-style course tile.
 * - 16:9 thumbnail, duration overlay, channel avatar + meta below.
 * - No card chrome, flat, dense — like youtube.com grid.
 */
export const CourseVideoCard = forwardRef<HTMLDivElement, CourseVideoCardProps>(
  ({ product }, ref) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const discount = product.originalPrice
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;
    const channel = product.brand || DEFAULT_BRAND;
    const initial = channel.trim().charAt(0).toUpperCase();
    const studentsLabel = product.reviews > 0
      ? `${product.reviews.toLocaleString()} students`
      : "New course";

    return (
      <article ref={ref} className="group flex flex-col gap-3">
        {/* Thumbnail */}
        <figure className="relative aspect-video overflow-hidden rounded-xl bg-secondary/30 ring-1 ring-inset ring-border/60 transition-shadow duration-300 group-hover:shadow-[0_14px_36px_-14px_hsl(var(--primary)/0.28)] group-focus-within:ring-primary/60 motion-reduce:transition-none">
          <SmartImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[600ms] ease-out motion-safe:group-hover:scale-[1.04] motion-reduce:transition-none"
          />

          {/* Soft top-down overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/5 via-transparent to-foreground/20"
          />

          {(product as any).duration && (
            <span className="absolute bottom-2 right-2 bg-foreground/85 text-background text-[11px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm">
              <span className="sr-only">Duration: </span>
              {(product as any).duration}
            </span>
          )}

          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-md">
              <span className="sr-only">Discount: </span>
              −{discount}%
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlisted((v) => !v);
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            className={cn(
              "no-min-tap absolute top-2 right-2 h-9 w-9 grid place-items-center rounded-full backdrop-blur-md transition-all motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 focus-visible:opacity-100",
              isWishlisted
                ? "bg-primary/15 ring-1 ring-primary/40"
                : "bg-background/85 hover:bg-background"
            )}
          >
            <Heart
              aria-hidden="true"
              className={cn(
                "h-4 w-4",
                isWishlisted ? "fill-primary text-primary" : "text-muted-foreground"
              )}
            />
          </button>
        </figure>

        {/* Meta row — avatar + text */}
        <div className="flex gap-3 px-0.5">
          <div className="shrink-0 h-9 w-9 rounded-full bg-primary/10 text-primary grid place-items-center font-display font-bold text-sm">
            {initial}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-foreground text-sm md:text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground line-clamp-1">
              <span className="truncate">{channel}</span>
              {product.isAuthentic && (
                <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />
              )}
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
              <span>{studentsLabel}</span>
              {product.rating > 0 && (
                <>
                  <span aria-hidden>•</span>
                  <span>★ {product.rating.toFixed(1)}</span>
                </>
              )}
              <span aria-hidden>•</span>
              <Price amount={product.price} className="font-semibold text-foreground" />
              {product.originalPrice && (
                <Price
                  amount={product.originalPrice}
                  strike
                  className="text-muted-foreground/70"
                />
              )}
            </p>
          </div>
        </div>
      </article>
    );
  }
);

CourseVideoCard.displayName = "CourseVideoCard";

export const CourseVideoCardMemo = memo(
  CourseVideoCard,
  (a, b) =>
    a.product.id === b.product.id &&
    a.product.price === b.product.price &&
    a.product.image === b.product.image
);
(CourseVideoCardMemo as any).displayName = "CourseVideoCardMemo";
