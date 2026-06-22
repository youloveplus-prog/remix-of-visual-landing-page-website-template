import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ResourceCard } from "./ResourceCard";
import type { Resource } from "@/data/resources";
import { cn } from "@/lib/utils";

interface ResourceCarouselProps {
  resources: Resource[];
  title: string;
  avatarSrc?: string;
}

export function ResourceCarousel({ resources, title, avatarSrc }: ResourceCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
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

  if (resources.length === 0) return null;

  return (
    <section aria-label={title} className="relative">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {avatarSrc && (
            <img
              src={avatarSrc}
              alt=""
              className="w-9 h-9 rounded-full object-cover border border-border/70"
            />
          )}
          <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
        <div className="hidden md:flex items-center gap-1.5">
          <Arrow dir="prev" disabled={!canPrev} onClick={() => emblaApi?.scrollPrev()} />
          <Arrow dir="next" disabled={!canNext} onClick={() => emblaApi?.scrollNext()} />
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-5">
          {resources.map((r) => (
            <div
              key={r.slug}
              className="basis-[62%] sm:basis-[40%] md:basis-[30%] lg:basis-[23%] shrink-0"
            >
              <ResourceCard resource={r} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Arrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className={cn(
        "w-9 h-9 rounded-full border border-border/70 bg-card flex items-center justify-center transition",
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "hover:border-primary/60 hover:text-primary",
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
