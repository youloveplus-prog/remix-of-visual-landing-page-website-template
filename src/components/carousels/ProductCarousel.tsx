import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHeader } from "@/components/ui/section-header";
import { Product } from "@/types";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  viewAllHref?: string;
  className?: string;
}

export function ProductCarousel({ products, title, viewAllHref, className }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
    dragFree: false,
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
  }, [emblaApi, update]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={cn("relative", className)}>
      {/* Unified header */}
      {(title || viewAllHref) && (
        <div className="px-3 sm:px-4 lg:px-0">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              {title && <SectionHeader title={title} viewAllHref={viewAllHref} />}
            </div>
            <div className="hidden md:flex items-center gap-2 mb-1 shrink-0">
              <CarouselArrow direction="prev" disabled={!canPrev} onClick={scrollPrev} />
              <CarouselArrow direction="next" disabled={!canNext} onClick={scrollNext} />
            </div>
          </div>
        </div>
      )}

      {/* Carousel with edge fades */}
      <div className="relative">
        {/* Edge gradient fades — desktop only */}
        <div
          aria-hidden
          className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-background to-transparent"
        />

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-3 lg:gap-4 pl-3 sm:pl-4 lg:pl-0 pr-3 sm:pr-4 lg:pr-0 items-stretch">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_45%] sm:flex-[0_0_35%] md:flex-[0_0_28%] lg:flex-[0_0_23%] xl:flex-[0_0_19%] min-w-0 h-auto"
              >
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={cn(
        "h-10 w-10 lg:h-11 lg:w-11 grid place-items-center rounded-full",
        "bg-card/40 backdrop-blur-xl border border-border/60",
        "text-foreground hover:bg-foreground hover:text-background hover:border-foreground",
        "transition-all duration-300 active:scale-95",
        "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-card/40 disabled:hover:text-foreground disabled:hover:border-border/60"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
