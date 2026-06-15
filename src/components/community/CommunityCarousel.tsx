import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PostCard } from "./PostCard";
import { SectionHeader } from "@/components/ui/section-header";
import { LivePulse } from "./LivePulse";
import { useCommunityFeed } from "@/hooks/useCommunityFeed";
import type { Post } from "@/types";

interface CommunityCarouselProps {
  /** Optional override. When omitted the carousel self-loads from the live feed. */
  posts?: Post[];
  title?: string;
  viewAllHref?: string;
}

export function CommunityCarousel({
  posts: postsOverride,
  title = "From the community",
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
  }, [emblaApi, update, posts.length]);

  return (
    <section className="section-x">
      <div className="flex flex-col items-center text-center gap-2">
        <LivePulse count={feed.liveCount} />
        <SectionHeader title={title} viewAllHref={viewAllHref} viewAllLabel="View all" />
      </div>

      <div className="relative mt-2">
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

            <div className="mt-4 flex items-center justify-center gap-1.5">
              <ArrowBtn dir="prev" disabled={!canPrev} onClick={() => emblaApi?.scrollPrev()} />
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
          <div className="h-[520px] rounded-2xl bg-muted/40 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <h3 className="font-display text-xl mb-2">Be the first to share</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Post your study haul, AI experiments or wins — the community feed starts with you.
      </p>
      <Link
        to="/create"
        className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Create a post
      </Link>
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
        "h-9 w-9 grid place-items-center rounded-full",
        "bg-card/70 backdrop-blur-xl border border-border/60",
        "text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40",
        "transition-all duration-200 active:scale-95",
        "disabled:opacity-30 disabled:cursor-not-allowed",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
