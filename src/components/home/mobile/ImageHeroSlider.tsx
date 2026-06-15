import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomeBanners } from "@/hooks/useHomeBanners";
import { cn } from "@/lib/utils";
import { buildSrcSet, transformedSrc } from "@/lib/imageSrcset";
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

export function ImageHeroSlider({ fullWidth = false }: { fullWidth?: boolean } = {}) {
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

  // Warm the browser cache for the next slide so transitions feel instant.
  useEffect(() => {
    const list = banners && banners.length > 0 ? banners : FALLBACK_BANNERS;
    if (list.length < 2) return;
    const nextIdx = (selected + 1) % list.length;
    const next = list[nextIdx];
    if (!next?.image_url) return;
    const img = new Image();
    img.decoding = "async";
    img.src = transformedSrc(next.image_url, 1280);
    const srcset = buildSrcSet(next.image_url);
    if (srcset) (img as any).srcset = srcset;
  }, [selected, banners]);

  if (isLoading) {
    return (
      <div className={fullWidth ? "" : "section-x"}>
        <Skeleton
          className={cn(
            "w-full rounded-3xl",
            fullWidth
              ? "aspect-[16/9] md:aspect-[21/9] xl:aspect-[24/9] 2xl:aspect-[32/10] max-h-[640px]"
              : "aspect-[21/10]"
          )}
        />
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
    <section className={fullWidth ? "" : "section-x"}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {items.map((b, idx) => {
            const isFirst = idx === 0;
            const Inner = (
              <div
                className={cn(
                  "group relative w-full overflow-hidden bg-card border border-border",
                  fullWidth
                    ? "rounded-none md:rounded-3xl aspect-[16/9] md:aspect-[21/9] xl:aspect-[24/9] 2xl:aspect-[32/10] max-h-[640px]"
                    : "rounded-3xl aspect-[16/9]"
                )}
              >
                <img
                  src={transformedSrc(b.image_url, 1280)}
                  srcSet={buildSrcSet(b.image_url)}
                  sizes={
                    fullWidth
                      ? "(min-width: 1536px) 100vw, (min-width: 1024px) 100vw, 100vw"
                      : "(min-width: 768px) 55vw, (min-width: 640px) 70vw, 100vw"
                  }
                  alt={b.alt_text ?? b.title ?? "Promotional banner"}
                  loading={isFirst ? "eager" : "lazy"}
                  decoding={isFirst ? "sync" : "async"}
                  {...({ fetchpriority: isFirst ? "high" : "low" } as any)}
                  width={1920}
                  height={720}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>
            );
            return (
              <div
                key={b.id}
                className={cn(
                  "shrink-0 grow-0 basis-full pressable",
                  !fullWidth && "sm:basis-[70%] md:basis-[55%]"
                )}
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
                selected === i ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

