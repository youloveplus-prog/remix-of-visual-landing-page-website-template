import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ShieldCheck, Zap, BadgeCheck, RefreshCcw, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import student from "@/assets/trust-student-1.jpg";
import certificate from "@/assets/trust-certificate.jpg";
import mentor from "@/assets/trust-mentor.jpg";
import workspace from "@/assets/trust-workspace.jpg";

const slides = [
  {
    image: student,
    eyebrow: "Real learners",
    title: "12,400+ students learning today",
    body: "Active from Dhaka to Chattogram — calm, focused, on their own schedule.",
    icon: BadgeCheck,
  },
  {
    image: certificate,
    eyebrow: "Verified certificates",
    title: "A signed completion for every course",
    body: "Share it on LinkedIn, attach it to your CV, keep it forever.",
    icon: ShieldCheck,
  },
  {
    image: mentor,
    eyebrow: "1-on-1 mentorship",
    title: "Personal teachers, waitlist-only",
    body: "Hand-picked mentors who actually sit with your child each week.",
    icon: BadgeCheck,
  },
  {
    image: workspace,
    eyebrow: "Instant access",
    title: "Buy today, start in 30 seconds",
    body: "All digital — no shipping, no waiting. Pay with card or bKash.",
    icon: Zap,
  },
];

const guarantees = [
  { icon: Zap, label: "Instant access" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: BadgeCheck, label: "Verified buyers" },
  { icon: RefreshCcw, label: "7-day money-back" },
];

export function TrustCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", containScroll: false },
    [Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: true })],
  );
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
  }, [emblaApi, update]);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-card">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {slides.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="flex-[0_0_100%] min-w-0 grid md:grid-cols-2 gap-0 items-stretch"
                >
                  <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[22rem] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      loading="lazy"
                      width={1024}
                      height={1024}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-background/20" />
                  </div>
                  <div className="flex flex-col justify-center gap-4 p-6 md:p-10 text-center md:text-left items-center md:items-start">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary">
                      <Icon className="h-3.5 w-3.5" />
                      <span className="editorial-eyebrow text-primary">{s.eyebrow}</span>
                    </span>
                    <h3 className="font-display font-bold text-2xl md:text-3xl tracking-[-0.02em] leading-[1.1] max-w-[22ch]">
                      {s.title}
                    </h3>
                    <p className="editorial-dek max-w-[36ch]">{s.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute top-3 right-3 hidden md:flex items-center gap-1.5">
          <ArrowBtn dir="prev" disabled={!canPrev} onClick={() => emblaApi?.scrollPrev()} />
          <ArrowBtn dir="next" disabled={!canNext} onClick={() => emblaApi?.scrollNext()} />
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === selected ? "w-8 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/40",
            )}
          />
        ))}
      </div>

      {/* Guarantee strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {guarantees.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-2xl border border-foreground/10 bg-card px-3.5 py-3"
          >
            <span className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-[13px] font-medium text-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowBtn({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = dir === "prev" ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      aria-label={dir === "prev" ? "Previous" : "Next"}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-9 w-9 rounded-full border border-foreground/10 bg-background/85 backdrop-blur grid place-items-center transition-all",
        "hover:bg-background hover:border-foreground/30 hover:-translate-y-0.5",
        "disabled:opacity-40 disabled:hover:translate-y-0",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
