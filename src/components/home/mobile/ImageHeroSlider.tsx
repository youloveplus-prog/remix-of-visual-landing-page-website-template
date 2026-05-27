import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeBanners } from "@/hooks/useHomeBanners";
import { cn } from "@/lib/utils";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";

const FALLBACK_BANNERS = [
  {
    id: "fb-1",
    image_url: courseAiMl,
    alt_text: "Learn AI with Asikon",
    link_url: "/shop?type=courses",
    eyebrow: "New course",
    title: "Master AI & ML",
    subtitle: "Expert-led courses in Python, ML and modern AI tools",
  },
  {
    id: "fb-2",
    image_url: promptLibrary,
    alt_text: "1000+ AI Prompts",
    link_url: "/prompts",
    eyebrow: "Prompt library",
    title: "1000+ AI Prompts",
    subtitle: "Boost your productivity with our curated prompts",
  },
  {
    id: "fb-3",
    image_url: coursePython,
    alt_text: "Skill-Up Friday — 50% off",
    link_url: "/shop?filter=deals",
    eyebrow: "Limited deal",
    title: "Skill-Up Friday",
    subtitle: "50% off on top-rated courses and books — this week only",
  },
];

export function ImageHeroSlider() {
  const { data: banners, isLoading } = useHomeBanners("hero");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 4500, stopOnInteraction: false })],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSel);
    onSel();
    return () => {
      emblaApi.off("select", onSel);
    };
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="section-x">
        <Skeleton className="w-full aspect-[21/10] rounded-3xl" />
      </div>
    );
  }

  const items = (banners && banners.length > 0 ? banners : FALLBACK_BANNERS) as Array<{
    id: string;
    image_url: string;
    alt_text?: string | null;
    link_url?: string | null;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  }>;
  if (items.length === 0) return null;

  return (
    <section className="section-x">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {items.map((b, idx) => {
            const isFirst = idx === 0;
            const Inner = (
              <div className="group relative w-full aspect-[16/10] rounded-3xl overflow-hidden bg-card border border-border">
                <img
                  src={b.image_url}
                  alt={b.alt_text ?? b.title ?? "Promotional banner"}
                  loading={isFirst ? "eager" : "lazy"}
                  decoding={isFirst ? "sync" : "async"}
                  {...({ fetchpriority: isFirst ? "high" : "low" } as any)}
                  width={1200}
                  height={750}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-30 group-hover:opacity-50 transition-opacity"
                />
                {/* Ambient brand glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 rounded-full"
                  style={{ background: "hsl(var(--primary) / 0.25)", filter: "blur(80px)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />

                {b.eyebrow && (
                  <span className="absolute top-5 left-5 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-primary/10 border border-primary/25 text-primary">
                    {b.eyebrow}
                  </span>
                )}

                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  {b.title && (
                    <h2 className="font-display font-bold text-3xl leading-[1.05] text-foreground mb-2">
                      {b.title}
                    </h2>
                  )}
                  {b.subtitle && (
                    <p className="text-sm text-muted-foreground max-w-[260px] line-clamp-2">{b.subtitle}</p>
                  )}
                </div>

                <div className="absolute bottom-5 right-5 z-10 w-10 h-10 rounded-full bg-background/40 border border-border backdrop-blur-sm flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

            );
            return (
              <div
                key={b.id}
                className="shrink-0 grow-0 basis-[92%] sm:basis-[70%] md:basis-[55%] pressable"
              >
                {b.link_url ? (
                  <Link to={b.link_url} className="block focus-ring rounded-3xl">
                    {Inner}
                  </Link>
                ) : (
                  Inner
                )}
              </div>
            );
          })}
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                selected === i ? "w-5 bg-primary" : "w-1.5 bg-white/20",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

