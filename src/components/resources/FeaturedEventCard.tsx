import { CountdownClock } from "./CountdownClock";
import { Sparkles } from "lucide-react";

interface FeaturedEventCardProps {
  eyebrow?: string;
  title: string;
  date: string; // human label e.g. "Coming up July 9th"
  target: string; // ISO target
  description: string;
  ctaLabel?: string;
  ctaHref: string;
}

export function FeaturedEventCard({
  eyebrow = "Free Live Event",
  title,
  date,
  target,
  description,
  ctaLabel = "Secure your free seat",
  ctaHref,
}: FeaturedEventCardProps) {
  return (
    <section
      aria-labelledby="featured-event-title"
      className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card shadow-[var(--shadow-elevated)]"
    >
      {/* Indigo aurora glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 opacity-90"
        style={{
          background:
            "radial-gradient(60% 60% at 18% 12%, hsl(var(--brand-from) / 0.18) 0%, transparent 60%), radial-gradient(50% 50% at 88% 18%, hsl(233 72% 70% / 0.18) 0%, transparent 60%), radial-gradient(60% 60% at 50% 100%, hsl(233 72% 65% / 0.12) 0%, transparent 70%)",
        }}
      />
      {/* Confetti sparkles */}
      <Sparkles
        aria-hidden
        className="absolute top-6 left-6 w-4 h-4 text-primary/40"
      />
      <Sparkles
        aria-hidden
        className="absolute top-12 right-10 w-3 h-3 text-primary/30"
      />
      <Sparkles
        aria-hidden
        className="absolute bottom-10 left-12 w-3.5 h-3.5 text-primary/40"
      />
      <Sparkles
        aria-hidden
        className="absolute bottom-6 right-6 w-3 h-3 text-primary/30"
      />

      <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </span>

        <h2
          id="featured-event-title"
          className="mt-5 font-display font-bold text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.05] tracking-[-0.02em] text-foreground"
        >
          {title}
        </h2>

        <p className="mt-3 font-dot text-[11px] uppercase tracking-[0.22em] text-primary">
          {date}
        </p>

        <div className="mt-7">
          <CountdownClock target={target} />
        </div>

        <p className="mt-7 text-[15px] sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
          {description}
        </p>

        <a
          href={ctaHref}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
