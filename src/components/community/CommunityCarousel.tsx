import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PostCard } from "./PostCard";
import { LivePulse } from "./LivePulse";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";
import type { Post } from "@/types";

interface CommunityCarouselProps {
  /** Optional override. When omitted the carousel self-loads from the live feed. */
  posts?: Post[];
  title?: string;
  subtitle?: string;
  viewAllHref?: string;
}

export function CommunityCarousel({
  posts: postsOverride,
  title = "From the community",
  subtitle = "Stories, wins, and AI experiments — fresh from learners.",
  viewAllHref = "/community",
}: CommunityCarouselProps) {
  const feed = useCommunityFeed(12);
  const posts = postsOverride ?? feed.posts;
  const isLoading = postsOverride ? false : feed.isLoading;

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const autoplay = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: !prefersReducedMotion,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      slidesToScroll: 1,
      containScroll: "trimSnaps",
      loop: posts.length > 2,
    },
    [autoplay.current],
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [snaps, setSnaps] = useState<number[]>([]);
  const [selected, setSelected] = useState(0);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", () => {
      setSnaps(emblaApi.scrollSnapList());
      update();
    });
  }, [emblaApi, update, posts.length]);

  return (
    <section className="section-x" aria-labelledby="community-carousel-title">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-center text-center gap-2 md:items-start md:text-left">
          <LivePulse count={feed.liveCount} variant="inline" />
          <h2
            id="community-carousel-title"
            className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight tracking-tight"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground max-w-md">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 md:justify-end">
          <div className="hidden md:flex items-center gap-1.5">
            <ArrowBtn dir="prev" disabled={!canPrev} onClick={() => emblaApi?.scrollPrev()} />
            <ArrowBtn dir="next" disabled={!canNext} onClick={() => emblaApi?.scrollNext()} />
          </div>
          <Link
            to={viewAllHref}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium",
              "bg-card/70 backdrop-blur-xl border border-border/60 text-foreground",
              "hover:bg-primary/10 hover:text-primary hover:border-primary/40",
              "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Carousel body */}
      <div className="relative mt-4 md:mt-6">
        <div
          aria-hidden
          className="hidden lg:block pointer-events-none absolute inset-y-0 left-0 w-10 z-10 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-10 z-10 bg-gradient-to-l from-background to-transparent"
        />

        {isLoading ? (
          <SkeletonRow />
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex gap-4 lg:gap-5 items-stretch">
                {posts.map((post) => {
                  const fresh = !postsOverride && feed.isNew(post.id);
                  return (
                    <div
                      key={post.id}
                      className={cn(
                        "flex-[0_0_100%] sm:flex-[0_0_85%] md:flex-[0_0_60%] lg:flex-[0_0_calc(50%-10px)] min-w-0 relative",
                        fresh && "animate-in fade-in slide-in-from-left-4 duration-500",
                      )}
                    >
                      {fresh && (
                        <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[9px] font-mono uppercase tracking-[0.18em] text-primary-foreground shadow-md">
                          <Sparkles className="h-2.5 w-2.5" />
                          New
                        </span>
                      )}
                      <PostCard post={post} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile controls: arrows + progress dots */}
            <div className="mt-5 flex items-center justify-center gap-4 md:hidden">
              <ArrowBtn dir="prev" disabled={!canPrev} onClick={() => emblaApi?.scrollPrev()} />
              <div className="flex items-center gap-1.5">
                {snaps.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === selected ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground/40",
                    )}
                  />
                ))}
              </div>
              <ArrowBtn dir="next" disabled={!canNext} onClick={() => emblaApi?.scrollNext()} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function SkeletonRow() {
  return (
    <div className="flex gap-4 lg:gap-5">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex-[0_0_100%] sm:flex-[0_0_85%] md:flex-[0_0_60%] lg:flex-[0_0_calc(50%-10px)] min-w-0"
        >
          <div className="h-[360px] sm:h-[440px] md:h-[520px] rounded-2xl bg-muted/40 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <h3 className="font-display text-xl mb-2">Be the first to share</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
        Post your study haul, AI experiments or wins — the community feed starts with you.
      </p>
      <div className="flex items-center justify-center gap-2">
        <Link
          to="/create"
          className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Create a post
        </Link>
        <Link
          to="/community"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card/70 px-4 text-sm font-medium text-foreground hover:bg-muted/50"
        >
          Browse community
        </Link>
      </div>
    </div>
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
        "h-10 w-10 grid place-items-center rounded-full",
        "bg-card/70 backdrop-blur-xl border border-border/60",
        "text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40",
        "transition-all duration-200 active:scale-95",
        "disabled:opacity-30 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
