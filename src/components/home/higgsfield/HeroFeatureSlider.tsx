import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type Slide = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  image: string;
  to: string;
  accent?: string; // tailwind color class for title (e.g. text-lime-300)
};

const SLIDES: Slide[] = [
  {
    eyebrow: "New",
    title: "MEET ASIKON AI TUTOR",
    subtitle: "Available 24/7 with voice — your personal teacher in your pocket.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1800&q=75",
    to: "/learn",
  },
  {
    title: "GENERATE LESSONS FROM A SINGLE PROMPT",
    subtitle: "Type what you want to learn. Get a course, quizzes and notes instantly.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=75",
    to: "/prompts",
  },
  {
    title: "ASIKON PLUGIN FOR YOUR WORKFLOW",
    subtitle: "Bring AI lessons into your tools — Notion, VS Code, Chrome.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=75",
    to: "/resources",
  },
  {
    title: "INTRODUCING MENTORS 4.1",
    subtitle: "Crisp 1-on-1 sessions, refined matching, total control over your path.",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1800&q=75",
    to: "/mentors",
    accent: "text-lime-300",
  },
  {
    title: "PROJECT-BASED COURSE TRACKS",
    subtitle: "Build real things while you learn. Ship, don't just study.",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1800&q=75",
    to: "/shop?type=courses",
  },
];

export function HeroFeatureSlider({
  autoplay = true,
  intervalMs = 5000,
  pauseOnHover = true,
}: {
  autoplay?: boolean;
  /** Time between slides in milliseconds. */
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
      // Require a deliberate horizontal drag before claiming the gesture.
      // Combined with `touch-action: pan-y` on the wrapper, near-vertical
      // gestures stay with the page scroller and never trigger a slide.
      dragThreshold: 18,
      // Only listen to primary pointer (ignores multi-touch / pinch).
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
      className="relative isolate w-full overflow-hidden bg-black py-5 sm:py-10"
    >
      {/* Carousel */}
      <div className="relative">
        <div
          ref={emblaRef}
          className="overflow-hidden touch-pan-y overscroll-x-contain"
        >
          {/* Horizontal padding creates the peek on both sides of the active card */}
          <div className="flex touch-pan-y px-4 sm:px-6 -mx-1 sm:-mx-2">
            {SLIDES.map((s, i) => (
              <div
                key={s.title}
                className="shrink-0 grow-0 basis-[92%] sm:basis-[72%] lg:basis-[62%] xl:basis-[56%] px-1 sm:px-2"
              >
                <Link
                  to={s.to}
                  className="group block"
                  aria-label={s.title}
                >
                  <div
                    className={`relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden border border-white/10 bg-neutral-900 transition-all duration-500 ${
                      selected === i
                        ? "opacity-100 scale-100"
                        : "opacity-50 scale-[0.96]"
                    }`}
                  >
                    <img
                      src={s.image}
                      alt=""
                      loading={i === 0 ? "eager" : "lazy"}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/10 to-transparent" />
                    {s.eyebrow && (
                      <span className="absolute left-3 top-3 sm:left-4 sm:top-4 inline-flex items-center gap-1 bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                        <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--hf-accent))]" />
                        {s.eyebrow}
                      </span>
                    )}
                  </div>

                  {/* Caption under the card */}
                  <div className="mt-3 sm:mt-4 px-0.5 sm:px-2">
                    <h3
                      className={`font-display text-[13px] sm:text-[17px] font-bold tracking-[0.04em] uppercase leading-tight transition-colors line-clamp-1 ${
                        s.accent ?? "text-white"
                      } group-hover:text-[hsl(var(--hf-accent))]`}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-1 sm:mt-1.5 text-[12px] sm:text-sm text-white/55 line-clamp-1">
                      {s.subtitle}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Side nav arrows — hidden on mobile (swipe only), shown ≥ sm */}
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

      {/* Progress indicator — minimal hairline segments */}
      <div className="mt-2.5 sm:mt-4 flex items-center justify-center gap-[3px]">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-[2px] rounded-full transition-all duration-300 ease-out ${
              selected === i
                ? "w-3.5 sm:w-4 bg-white"
                : "w-[2px] bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroFeatureSlider;
