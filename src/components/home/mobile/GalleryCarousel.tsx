import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import courseAiMl from "@/assets/course-ai-ml.jpg";
import coursePython from "@/assets/course-python.jpg";
import promptLibrary from "@/assets/prompt-library.jpg";
import aiTutor from "@/assets/ai-tutor.jpg";
import bookHardcover from "@/assets/book-hardcover.jpg";
import studentKit from "@/assets/student-kit.jpg";

type Slide = {
  id: string;
  image: string;
  title: string;
  caption: string;
  href: string;
};

const SLIDES: Slide[] = [
  { id: "g1", image: courseAiMl, title: "AI & ML lab", caption: "Hands-on Python & ML", href: "/shop?type=courses" },
  { id: "g2", image: aiTutor, title: "24/7 AI tutor", caption: "Ask anything, anytime", href: "/learn" },
  { id: "g3", image: promptLibrary, title: "Prompt library", caption: "1000+ curated prompts", href: "/prompts" },
  { id: "g4", image: coursePython, title: "Python from zero", caption: "Beginner-friendly path", href: "/shop?type=courses" },
  { id: "g5", image: bookHardcover, title: "Learning library", caption: "Books & study guides", href: "/shop?type=books" },
  { id: "g6", image: studentKit, title: "Student kits", caption: "Essentials shipped to you", href: "/shop" },
];

export function GalleryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true, containScroll: "trimSnaps" },
    [Autoplay({ delay: 3500, stopOnInteraction: true })],
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSel);
    emblaApi.on("reInit", () => setSnaps(emblaApi.scrollSnapList()));
    onSel();
    return () => {
      emblaApi.off("select", onSel);
    };
  }, [emblaApi]);

  return (
    <section className="section-x">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground mb-1">
            Inside Asikon
          </p>
          <h2 className="font-display font-bold text-xl text-foreground">Gallery</h2>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
          Swipe →
        </span>
      </div>

      <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
        <div className="flex gap-3">
          {SLIDES.map((s, idx) => (
            <Link
              key={s.id}
              to={s.href}
              className="group shrink-0 grow-0 basis-[68%] sm:basis-[42%] md:basis-[32%] focus-ring rounded-3xl"
            >
              <div className="midnight-tile relative aspect-[3/4] overflow-hidden rounded-3xl">
                <img
                  src={s.image}
                  alt={s.title}
                  loading={idx < 2 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Brand glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full"
                  style={{ background: "hsl(var(--primary) / 0.25)", filter: "blur(60px)" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

                <div className="relative z-10 h-full flex flex-col justify-end p-4">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-primary mb-1">
                    {s.caption}
                  </p>
                  <h3 className="font-display font-bold text-base text-foreground leading-tight flex items-start gap-1">
                    {s.title}
                    <ArrowUpRight className="h-3.5 w-3.5 mt-0.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {snaps.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {snaps.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to gallery slide ${i + 1}`}
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
