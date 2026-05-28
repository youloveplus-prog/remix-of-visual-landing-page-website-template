import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostCard } from "./PostCard";
import { SectionHeader } from "@/components/ui/section-header";
import { Post } from "@/types";

interface CommunityCarouselProps {
  posts: Post[];
  title?: string;
  viewAllHref?: string;
}

export function CommunityCarousel({
  posts,
  title = "From the community",
  viewAllHref = "/community",
}: CommunityCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
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

  return (
    <section className="section-x">
      <div className="flex items-end justify-between gap-3">
        <div className="flex-1 min-w-0">
          <SectionHeader title={title} viewAllHref={viewAllHref} viewAllLabel="View all" />
        </div>
        <div className="hidden md:flex items-center gap-1.5 mb-4 lg:mb-5 shrink-0">
          <ArrowBtn dir="prev" disabled={!canPrev} onClick={() => emblaApi?.scrollPrev()} />
          <ArrowBtn dir="next" disabled={!canNext} onClick={() => emblaApi?.scrollNext()} />
        </div>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-background to-transparent"
        />

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex gap-4 lg:gap-5 items-stretch">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex-[0_0_100%] sm:flex-[0_0_85%] md:flex-[0_0_60%] lg:flex-[0_0_calc(50%-10px)] min-w-0"
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowBtn({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled?: boolean;
  onClick?: () => void;
}) {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className={cn(
        "h-9 w-9 grid place-items-center rounded-full",
        "bg-card/70 backdrop-blur-xl border border-border/60",
        "text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40",
        "transition-all duration-200 active:scale-95",
        "disabled:opacity-30 disabled:cursor-not-allowed"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
