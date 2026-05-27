import { Link } from "react-router-dom";
import { motion } from "motion/react";
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
  rot: number;
};

const SLIDES: Slide[] = [
  { id: "g1", image: courseAiMl, title: "AI & ML lab", caption: "Hands-on Python & ML", href: "/shop?type=courses", rot: -6 },
  { id: "g2", image: aiTutor, title: "24/7 AI tutor", caption: "Ask anything, anytime", href: "/learn", rot: 4 },
  { id: "g3", image: promptLibrary, title: "Prompt library", caption: "1000+ curated prompts", href: "/prompts", rot: -3 },
  { id: "g4", image: coursePython, title: "Python from zero", caption: "Beginner-friendly path", href: "/shop?type=courses", rot: 5 },
  { id: "g5", image: bookHardcover, title: "Learning library", caption: "Books & study guides", href: "/shop?type=books", rot: -5 },
  { id: "g6", image: studentKit, title: "Student kits", caption: "Essentials shipped to you", href: "/shop", rot: 3 },
];

const SPRING = { type: "spring" as const, stiffness: 220, damping: 20, mass: 0.8 };

export function GalleryCarousel() {
  // Duplicate for seamless marquee loop
  const row = [...SLIDES, ...SLIDES];

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
          Hover ↺
        </span>
      </div>

      <div className="relative overflow-hidden -mx-4 px-4 py-6 group/strip">
        {/* Edge fades */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-background to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="gallery-marquee flex w-max gap-4">
          {row.map((s, i) => (
            <motion.div
              key={`${s.id}-${i}`}
              initial={{ rotate: s.rot }}
              whileHover={{
                rotate: 0,
                scale: 1.08,
                y: -12,
                zIndex: 30,
                transition: SPRING,
              }}
              style={{ rotate: s.rot }}
              className="gallery-item relative shrink-0 w-[180px] sm:w-[220px] md:w-[240px]"
            >
              <Link to={s.href} className="block focus-ring rounded-2xl">
                <div className="midnight-tile relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl ring-1 ring-primary/15">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading={i < 3 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full"
                    style={{ background: "hsl(var(--primary) / 0.25)", filter: "blur(50px)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="relative z-10 h-full flex flex-col justify-end p-3">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-primary mb-1">
                      {s.caption}
                    </p>
                    <h3 className="font-display font-bold text-sm text-white leading-tight flex items-start gap-1">
                      {s.title}
                      <ArrowUpRight className="h-3.5 w-3.5 mt-0.5 opacity-70 shrink-0" />
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gallery-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .gallery-marquee {
          animation: gallery-marquee 40s linear infinite;
        }
        .gallery-marquee:has(.gallery-item:hover) {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
