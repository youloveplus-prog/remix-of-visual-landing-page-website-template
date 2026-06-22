import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { homeType } from "@/components/home/typography";

type SlideMedia =
  | { kind: "image"; src: string; poster?: never }
  | { kind: "video"; src: string; poster?: string };

type Slide = {
  eyebrow?: string;
  /** Short brand/product chip shown on top of the hero media. */
  brand: string;
  title: string;
  /** One-line meaningful hook. Keep short — mobile. */
  hook: string;
  cta: string;
  media: SlideMedia;
  to: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "New",
    brand: "Asikon AI Tutor",
    title: "Your 24/7 AI teacher",
    hook: "Learn anything, anytime — voice-powered.",
    cta: "Try the tutor",
    media: {
      kind: "video",
      src: "https://cdn.pixabay.com/video/2023/10/08/184145-873592957_large.mp4",
      poster:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    },
    to: "/learn",
  },
  {
    brand: "Prompt → Course",
    title: "Lessons from one prompt",
    hook: "Type a topic. Get a full course in seconds.",
    cta: "Generate a lesson",
    media: {
      kind: "image",
      src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    },
    to: "/prompts",
  },
  {
    brand: "Asikon Plugin",
    title: "Learn inside your tools",
    hook: "Notion, VS Code, Chrome — AI lessons everywhere.",
    cta: "Get the plugin",
    media: {
      kind: "image",
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80",
    },
    to: "/resources",
  },
  {
    brand: "Mentors 4.1",
    title: "1-on-1 with real experts",
    hook: "Personal mentorship, matched to your goals.",
    cta: "Find a mentor",
    media: {
      kind: "video",
      src: "https://cdn.pixabay.com/video/2022/12/19/144064-781136941_large.mp4",
      poster:
        "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80",
    },
    to: "/mentors",
  },
  {
    brand: "Project Tracks",
    title: "Build real things",
    hook: "Ship projects while you learn — not just study.",
    cta: "Browse tracks",
    media: {
      kind: "image",
      src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80",
    },
    to: "/shop?type=courses",
  },
];

/** Renders either an image or an autoplaying muted/inline video that pauses when off-screen. */
function HeroMedia({ media, eager }: { media: SlideMedia; eager: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Pause off-screen videos to save battery / data.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (media.kind === "video") {
    return (
      <video
        ref={videoRef}
        src={media.src}
        poster={media.poster}
        muted
        loop
        playsInline
        autoPlay
        preload={eager ? "auto" : "metadata"}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <img
      src={media.src}
      alt=""
      loading={eager ? "eager" : "lazy"}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
      draggable={false}
    />
  );
}

export function HeroFeatureSlider({
  autoplay = true,
  intervalMs = 5500,
  pauseOnHover = true,
}: {
  autoplay?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
} = {}) {
  const autoplayRef = useRef(
    Autoplay({
      delay: intervalMs,
      stopOnInteraction: false,
      stopOnMouseEnter: pauseOnHover,
      stopOnFocusIn: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      containScroll: false,
      skipSnaps: false,
      dragThreshold: 18,
      watchDrag: (api, evt) => {
        if (evt instanceof PointerEvent && !evt.isPrimary) return false;
        return true;
      },
    },
    autoplay ? [autoplayRef.current] : [],
  );
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi]);

  return (
    <section
      aria-label="Featured"
      className="relative isolate w-full overflow-hidden bg-black sm:py-10"
    >
      <div className="relative">
        <div
          ref={emblaRef}
          className="overflow-hidden touch-pan-y overscroll-x-contain"
        >
          {/*
            Mobile: full-bleed 16:9 (basis-100%, no horizontal padding).
            sm+: peek-card carousel.
          */}
          <div className="flex touch-pan-y sm:px-6 sm:-mx-2">
            {SLIDES.map((s, i) => {
              const isActive = selected === i;
              return (
                <div
                  key={s.title}
                  className="shrink-0 grow-0 basis-full sm:basis-[72%] lg:basis-[62%] xl:basis-[56%] sm:px-2"
                >
                  <article
                    className={`relative transition-all duration-500 ${
                      isActive ? "opacity-100 scale-100" : "opacity-60 sm:scale-[0.96]"
                    }`}
                  >
                    {/* === Hero media (full-bleed 16:9 on mobile) === */}
                    <Link
                      to={s.to}
                      aria-label={s.title}
                      className="group relative block aspect-[16/9] overflow-hidden bg-neutral-900 sm:border sm:border-white/10"
                    >
                      <HeroMedia media={s.media} eager={i === 0} />
                      {/* Brand-tinted cinematic gradient — top fade for chip, bottom fade for brand pill */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-[hsl(var(--brand-from)/0.85)]" />

                      {/* Eyebrow (top-left) */}
                      {s.eyebrow && (
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur ring-1 ring-white/15">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {s.eyebrow}
                        </span>
                      )}

                      {/* Brand pill — centered along the bottom of the media */}
                      <span className="absolute left-1/2 bottom-3 sm:bottom-4 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-black/65 px-3.5 py-1.5 text-[12px] sm:text-[13px] font-medium text-white backdrop-blur-md ring-1 ring-white/15 whitespace-nowrap">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        {s.brand}
                      </span>
                    </Link>

                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile dot indicators — overlaid on the hero media, below the brand pill */}
        <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex items-center justify-center gap-2 sm:hidden">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => emblaApi?.scrollTo(idx)}
              style={{ width: 6, height: 6, minWidth: 6, minHeight: 6, maxWidth: 6, maxHeight: 6, padding: 0, borderRadius: "50%", aspectRatio: "1 / 1", display: "block", flex: "0 0 auto" }}
              className={`pointer-events-auto shrink-0 border-0 transition-colors duration-300 ${
                selected === idx ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>




        {/* Side nav arrows — desktop only */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Previous"
          className="hidden sm:grid absolute left-2 sm:left-4 top-[calc(50%-3.5rem)] -translate-y-1/2 z-10 h-10 w-10 sm:h-11 sm:w-11 place-items-center bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition hover:bg-white/20 hover:scale-105"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Next"
          className="hidden sm:grid absolute right-2 sm:right-4 top-[calc(50%-3.5rem)] -translate-y-1/2 z-10 h-10 w-10 sm:h-11 sm:w-11 place-items-center bg-white/10 text-white backdrop-blur-md ring-1 ring-white/20 transition hover:bg-white/20 hover:scale-105"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      {/* Desktop dot strip */}
      <div className="hidden sm:flex mt-4 items-center justify-center gap-[3px]">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-[2px] rounded-full transition-all duration-300 ease-out ${
              selected === i ? "w-4 bg-primary" : "w-[2px] bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroFeatureSlider;
