import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Star, ShieldCheck, GraduationCap } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import tutorSsc from "@/assets/tutor-ssc.jpg";
import tutorHsc from "@/assets/tutor-hsc.jpg";
import tutorBsc from "@/assets/tutor-bsc.jpg";

type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  badge: string;
};

const slides: Slide[] = [
  {
    image: tutorSsc,
    eyebrow: "For SSC parents",
    title: "Help your child ace SSC with a personal tutor.",
    body: "Verified university tutors come to your home. Book a free demo class today.",
    badge: "SSC",
  },
  {
    image: tutorHsc,
    eyebrow: "For HSC parents",
    title: "A focused HSC tutor, matched to your child.",
    body: "Top BUET and Dhaka University students teach one-on-one. Try the first class free.",
    badge: "HSC",
  },
  {
    image: tutorBsc,
    eyebrow: "For BSc students",
    title: "University-level tutoring, on your schedule.",
    body: "BSc subjects taught by senior students and graduates. Free intro session.",
    badge: "BSc",
  },
];

const trustItems = [
  { icon: ShieldCheck, label: "Verified tutors" },
  { icon: GraduationCap, label: "Top universities" },
];

export function MentorshipHomeSection() {
  const autoplay = useRef(Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay.current]);
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

  return (
    <section className="section-x">
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-[0_30px_80px_-40px_hsl(var(--primary)/0.55)]">
        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.55), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.35), transparent 70%)" }}
        />

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {slides.map((s, i) => (
              <div
                key={i}
                className="relative flex-[0_0_100%] min-w-0 aspect-[16/11] sm:aspect-[16/8] lg:aspect-[16/6]"
              >
                <img
                  src={s.image}
                  alt={s.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 w-full h-full object-cover object-right scale-105"
                />
                {/* Primary horizontal gradient */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(95deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.94) 40%, hsl(var(--primary) / 0.55) 62%, transparent 88%)",
                  }}
                />
                {/* Bottom fade for legibility */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3"
                  style={{ background: "linear-gradient(to top, hsl(var(--primary) / 0.55), transparent)" }}
                />
                {/* Subtle grain */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "radial-gradient(hsl(0 0% 100%) 1px, transparent 1px)",
                    backgroundSize: "3px 3px",
                  }}
                />

                <div className="relative h-full flex flex-col justify-center p-5 sm:p-7 lg:p-10 max-w-[72%] sm:max-w-[60%] lg:max-w-[56%]">
                  {/* Eyebrow + level chip */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md text-primary-foreground text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 border border-white/25">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_hsl(142_71%_55%/0.9)]" />
                      {s.eyebrow}
                    </span>
                    <span className="hidden sm:inline-flex items-center rounded-md bg-white text-primary text-[10px] font-bold tracking-wider px-1.5 py-0.5 shadow">
                      {s.badge}
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-primary-foreground leading-[1.08] tracking-[-0.02em] text-[22px] sm:text-3xl lg:text-[42px]">
                    {s.title}
                  </h2>
                  <p className="text-primary-foreground/85 mt-2 sm:mt-3 leading-relaxed text-[12.5px] sm:text-sm lg:text-base max-w-md">
                    {s.body}
                  </p>

                  {/* Trust row */}
                  <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-primary-foreground/90">
                    <span className="inline-flex items-center gap-1">
                      <span className="flex">
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Star key={k} className="h-3 w-3 fill-amber-300 text-amber-300" />
                        ))}
                      </span>
                      <span className="font-semibold">4.9</span>
                      <span className="text-primary-foreground/70">· 1,200+ parents</span>
                    </span>
                    {trustItems.map(({ icon: Icon, label }) => (
                      <span key={label} className="hidden sm:inline-flex items-center gap-1">
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 lg:mt-6 flex items-center gap-3">
                    <Button asChild variant="secondary" size="lg" className="shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] font-semibold">
                      <Link to="/mentors" className="inline-flex items-center gap-1.5">
                        Book a free demo
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Link
                      to="/mentors"
                      className="hidden sm:inline-flex items-center gap-1 text-primary-foreground/85 hover:text-primary-foreground text-xs font-semibold underline-offset-4 hover:underline"
                    >
                      How it works
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-3 sm:bottom-4 left-5 sm:left-7 lg:left-10 flex items-center gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                selected === i ? "w-7 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-3 sm:bottom-4 right-5 sm:right-7 lg:right-10 z-10 text-[11px] font-semibold tabular-nums text-primary-foreground/80 bg-black/20 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/15">
          {String(selected + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}
