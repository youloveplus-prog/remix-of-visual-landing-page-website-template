import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type Slide = {
  eyebrow?: string;
  /** Short brand/product chip shown on top of the hero image (e.g. "Asikon AI Tutor"). */
  brand: string;
  title: string;
  /** One-line meaningful hook. Keep short — mobile. */
  hook: string;
  cta: string;
  image: string;
  to: string;
  accent?: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: "New",
    brand: "Asikon AI Tutor",
    title: "Your 24/7 AI teacher",
    hook: "Learn anything, anytime — voice-powered.",
    cta: "Try the tutor",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
    to: "/learn",
  },
  {
    brand: "Prompt → Course",
    title: "Lessons from one prompt",
    hook: "Type a topic. Get a full course in seconds.",
    cta: "Generate a lesson",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    to: "/prompts",
  },
  {
    brand: "Asikon Plugin",
    title: "Learn inside your tools",
    hook: "Notion, VS Code, Chrome — AI lessons everywhere.",
    cta: "Get the plugin",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80",
    to: "/resources",
  },
  {
    brand: "Mentors 4.1",
    title: "1-on-1 with real experts",
    hook: "Personal mentorship, matched to your goals.",
    cta: "Find a mentor",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1400&q=80",
    to: "/mentors",
    accent: "text-lime-300",
  },
  {
    brand: "Project Tracks",
    title: "Build real things",
    hook: "Ship projects while you learn — not just study.",
    cta: "Browse tracks",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80",
    to: "/shop?type=courses",
  },
];

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
            Mobile: full-bleed (basis-100%, no horizontal padding) so the active
            slide owns the full screen width — Higgsfield style.
            sm+: revert to the peek-card carousel.
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
                    {/* === Hero image (full-bleed on mobile) === */}
                    <Link
                      to={s.to}
                      aria-label={s.title}
                      className="group relative block aspect-[4/5] sm:aspect-[16/9] overflow-hidden bg-neutral-900 sm:border sm:border-white/10"
                    >
                      <img
                        src={s.image}
                        alt=""
                        loading={i === 0 ? "eager" : "lazy"}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                        draggable={false}
                      />
                      {/* Cinematic vertical fade so the brand chip + dark panel below blend in */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

                      {/* Eyebrow (top-left) */}
                      {s.eyebrow && (
                        <span className="absolute left-3 top-3 sm:left-4 sm:top-4 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur ring-1 ring-white/15">
                          <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                          {s.eyebrow}
                        </span>
                      )}

                      {/* Brand pill — centered, sits over the image (Higgsfield style) */}
                      <span className="absolute left-1/2 bottom-6 sm:bottom-8 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-black/65 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-md ring-1 ring-white/15 whitespace-nowrap">
                        <Sparkles className="h-3.5 w-3.5 text-lime-300" />
                        {s.brand}
                      </span>
                    </Link>

                    {/* === Dot indicator strip (between image and panel, mobile-first) === */}
                    <div className="flex items-center justify-center gap-1.5 py-3 bg-black sm:hidden">
                      {SLIDES.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          aria-label={`Go to slide ${idx + 1}`}
                          onClick={() => emblaApi?.scrollTo(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                            selected === idx ? "w-5 bg-white" : "w-1.5 bg-white/35"
                          }`}
                        />
                      ))}
                    </div>

                    {/* === Centered hook panel (mobile) / caption row (sm+) === */}
                    <div className="bg-black px-6 pb-8 pt-2 text-center sm:hidden">
                      <h2
                        className={`font-display text-[28px] leading-[1.05] font-extrabold uppercase tracking-tight text-balance ${
                          s.accent ?? "text-white"
                        }`}
                      >
                        {s.title}
                      </h2>
                      <p className="mx-auto mt-3 max-w-[28ch] text-[14px] leading-relaxed text-white/65">
                        {s.hook}
                      </p>
                      <Link
                        to={s.to}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime-300 px-6 py-3.5 text-[15px] font-semibold text-black shadow-[0_10px_30px_-8px_rgba(190,242,100,0.55)] active:scale-[0.98] transition-transform"
                      >
                        {s.cta}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* sm+ caption (keeps original desktop look) */}
                    <Link to={s.to} className="hidden sm:block mt-4 px-2 group">
                      <h3
                        className={`font-display text-[17px] font-bold tracking-[0.04em] uppercase leading-tight transition-colors line-clamp-1 ${
                          s.accent ?? "text-white"
                        } group-hover:text-[hsl(var(--hf-accent))]`}
                      >
                        {s.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-white/55 line-clamp-1">{s.hook}</p>
                    </Link>
                  </article>
                </div>
              );
            })}
          </div>
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

      {/* Desktop dot strip (mobile has its own inside each slide) */}
      <div className="hidden sm:flex mt-4 items-center justify-center gap-[3px]">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-[2px] rounded-full transition-all duration-300 ease-out ${
              selected === i ? "w-4 bg-white" : "w-[2px] bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroFeatureSlider;
