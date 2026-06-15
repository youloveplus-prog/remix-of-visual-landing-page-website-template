import { Link } from "react-router-dom";
import { motion, useInView, useAnimation } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import courseAiMl from "@/assets/course-ai-ml.webp";
import coursePython from "@/assets/course-python.webp";
import promptLibrary from "@/assets/prompt-library.webp";
import aiTutor from "@/assets/ai-tutor.webp";
import bookHardcover from "@/assets/book-hardcover.webp";
import studentKit from "@/assets/student-kit.webp";

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
  { id: "g5", image: bookHardcover, title: "Learning library", caption: "Books & study guides", href: "/shop?type=ebooks" },
];

// Final spread layout (5 cards) — center one slightly raised, outer ones tilted
const FINAL = [
  { x: -260, y: 20, rot: -10 },
  { x: -130, y: 4, rot: -5 },
  { x: 0, y: -8, rot: 0 },
  { x: 130, y: 4, rot: 5 },
  { x: 260, y: 20, rot: 10 },
];

// Mid "fan" pose — cards peeking out from a stack
const FAN = [
  { x: -90, y: 8, rot: -14 },
  { x: -45, y: 2, rot: -7 },
  { x: 0, y: 0, rot: 0 },
  { x: 45, y: 2, rot: 7 },
  { x: 90, y: 8, rot: 14 },
];

const SPRING = { type: "spring" as const, stiffness: 90, damping: 16, mass: 1.1 };

export function GalleryCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const controls = useAnimation();
  const titleControls = useAnimation();
  const [stage, setStage] = useState<0 | 1 | 2>(0); // 0=stack, 1=fan, 2=spread
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    (async () => {
      // Stage 0: stacked (initial)
      await new Promise((r) => setTimeout(r, 200));
      if (cancelled) return;
      // Stage 1: fan out
      setStage(1);
      await controls.start("fan");
      await new Promise((r) => setTimeout(r, 450));
      if (cancelled) return;
      // Stage 2: spread fully + reveal title
      setStage(2);
      controls.start("spread");
      titleControls.start({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } });
    })();
    return () => { cancelled = true; };
  }, [inView, controls, titleControls]);

  return (
    <section className="section-x">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground mb-1">
          </p>
          <h2 className="font-display font-bold text-xl text-foreground"></h2>
        </div>
      </div>

      <div
        ref={ref}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-background via-background to-primary/5 px-4 py-6 sm:py-10 ring-1 ring-primary/10"
      >
        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-primary/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 left-10 w-[260px] h-[260px] rounded-full bg-primary/10 blur-3xl" />

        {/* Title reveal */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={titleControls}
          className="relative z-10 text-center mb-4 sm:mb-8"
        >
          <p className="font-display text-xl sm:text-2xl text-foreground/80 italic">The Ultimate</p>
          <h3 className="font-display font-black text-3xl sm:text-5xl tracking-tight bg-gradient-to-r from-primary via-primary to-[hsl(var(--primary)/0.6)] bg-clip-text text-transparent">
            COLLECTIONS
          </h3>
        </motion.div>

        {/* Cards stage */}
        <div className="relative h-[240px] sm:h-[320px] flex items-center justify-center">
          {SLIDES.map((s, i) => {
            const isHover = hovered === i;
            return (
              <motion.div
                key={s.id}
                onMouseEnter={() => stage === 2 && setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                initial={{ x: 0, y: 0, rotate: 0, scale: 0.7, opacity: 0 }}
                animate={controls}
                variants={{
                  fan: {
                    x: FAN[i].x,
                    y: FAN[i].y,
                    rotate: FAN[i].rot,
                    scale: 0.9,
                    opacity: 1,
                    transition: { ...SPRING, delay: i * 0.08 },
                  },
                  spread: {
                    x: isHover ? 0 : FINAL[i].x,
                    y: isHover ? -24 : FINAL[i].y,
                    rotate: isHover ? 0 : FINAL[i].rot,
                    scale: isHover ? 1.12 : 1,
                    opacity: 1,
                    transition: { ...SPRING, delay: stage === 2 && !isHover ? i * 0.05 : 0 },
                  },
                }}
                style={{ zIndex: isHover ? 50 : 10 + i }}
                className="absolute"
              >
                <Link to={s.href} className="block focus-ring rounded-2xl">
                  <div className="relative w-[150px] h-[210px] sm:w-[190px] sm:h-[270px] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-primary/20 bg-card">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading={i < 3 ? "eager" : "lazy"}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-end p-3">
                      <p className="text-[9px] uppercase tracking-widest font-semibold text-primary mb-1">
                        {s.caption}
                      </p>
                      <h4 className="font-display font-bold text-sm text-white leading-tight flex items-start gap-1">
                        {s.title}
                        <ArrowUpRight className="h-3.5 w-3.5 mt-0.5 opacity-70 shrink-0" />
                      </h4>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Sub copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={titleControls}
          className="relative z-10 mt-6 text-center text-xs sm:text-sm text-muted-foreground max-w-md mx-auto"
        >
          We've built our collections to inspire the curious. Hand-picked learning kits, in one place.
        </motion.p>
      </div>
    </section>
  );
}
