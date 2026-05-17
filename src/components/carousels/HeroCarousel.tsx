import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  cta?: {
    label: string;
    href: string;
  };
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  autoplayDelay?: number;
  className?: string;
}

export function HeroCarousel({ slides, autoplayDelay = 5000, className }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || isPaused) return;
    const interval = setInterval(() => emblaApi.scrollNext(), autoplayDelay);
    return () => clearInterval(interval);
  }, [emblaApi, autoplayDelay, isPaused]);

  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_12px_36px_-12px_rgba(0,0,0,0.4)]", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative">
              <div className="relative aspect-[5/4] sm:aspect-[16/9] md:aspect-[21/9]">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding={index === 0 ? "sync" : "async"}
                  // @ts-expect-error fetchpriority valid HTML
                  fetchpriority={index === 0 ? "high" : "low"}
                />
                {/* Gradient overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                {/* Text block */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 text-white">
                  <h2 className="font-bold text-xl sm:text-2xl md:text-4xl leading-tight max-w-md drop-shadow">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="mt-1.5 text-sm sm:text-base text-white/85 max-w-md line-clamp-2">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.cta && (
                    <Link
                      to={slide.cta.href}
                      className="inline-flex items-center gap-1.5 mt-3 sm:mt-4 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 active:scale-95 transition"
                    >
                      {slide.cta.label}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows — desktop only */}
      <button
        onClick={scrollPrev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors hidden md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-colors hidden md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === selectedIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/70 w-1.5"
            )}
          />
        ))}
      </div>
    </div>
  );
}
