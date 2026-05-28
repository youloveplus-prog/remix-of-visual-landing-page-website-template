import { useState } from "react";
import { Target, Eye, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const ASIKON_MISSION = `ASIKON exists to make learning simple, smart, and accessible for every student. We focus on building an AI-powered education system that helps students learn faster, understand deeply, and stay motivated every day. Our mission is to remove the gap between traditional education and real-world skills by combining technology, teachers, and intelligent learning tools in one system. We want every learner to feel confident, independent, and future-ready.`;

export const ASIKON_VISION = `To become a leading AI-driven education ecosystem that transforms how students learn across Bangladesh and beyond. We imagine a future where every student has access to personalized learning, real guidance, and practical skills without barriers of location, cost, or system limitations. ASIKON will grow into a complete learning universe where education feels simple, powerful, and alive.`;

interface MissionVisionProps {
  variant?: "full" | "compact";
  className?: string;
}

interface PillarProps {
  icon: typeof Target;
  glyph: string;
  eyebrow: string;
  headline: string;
  body: string;
  tone: "primary" | "accent";
}

function Pillar({ icon: Icon, glyph, eyebrow, headline, body, tone }: PillarProps) {
  const [open, setOpen] = useState(false);
  const ringClass =
    tone === "primary"
      ? "from-primary/[0.08] to-accent/[0.04]"
      : "from-accent/[0.08] to-primary/[0.04]";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl sm:rounded-[1.75rem] liquid-glass bg-gradient-to-br p-5 sm:p-7",
        ringClass,
      )}
    >
      {/* Bangla glyph watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-3 -top-4 font-display text-[7rem] sm:text-[9rem] leading-none font-semibold text-foreground/[0.04] select-none"
        style={{ fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" }}
      >
        {glyph}
      </span>

      <div className="relative flex items-center gap-2.5 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-[0_6px_18px_-6px_hsl(var(--primary)/0.5)]"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Icon className="h-4 w-4 text-primary-foreground" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground">
          {eyebrow}
        </p>
      </div>

      <h3 className="relative font-display text-xl sm:text-2xl font-semibold tracking-[-0.015em] leading-[1.15] text-foreground">
        {headline}
      </h3>

      <p
        className={cn(
          "relative mt-3 text-[13px] sm:text-sm text-muted-foreground leading-[1.65] whitespace-pre-line transition-[max-height,opacity] duration-300 ease-out",
          // collapse on mobile, always show from sm+
          open
            ? "max-h-[600px] opacity-100"
            : "max-h-[4.5rem] sm:max-h-[600px] opacity-90 sm:opacity-100 overflow-hidden",
        )}
      >
        {body}
      </p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative sm:hidden mt-2 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-primary"
      >
        {open ? "Show less" : "Read more"}
        <ChevronDown
          className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
        />
      </button>
    </article>
  );
}

export function MissionVision({ variant = "full", className }: MissionVisionProps) {
  if (variant === "compact") {
    return (
      <div className={cn("rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-4", className)}>
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">The ASIKON Promise</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          AI-powered learning that makes education simple, smart, and accessible —
          helping every student learn faster, understand deeply, and stay future-ready.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 sm:gap-5 md:grid-cols-2", className)}>
      <Pillar
        icon={Target}
        glyph="অ"
        eyebrow="Our Mission"
        headline="Learn faster. Understand deeper."
        body={ASIKON_MISSION}
        tone="primary"
      />
      <Pillar
        icon={Eye}
        glyph="আ"
        eyebrow="Our Vision"
        headline="A learning universe for every Bangladeshi."
        body={ASIKON_VISION}
        tone="accent"
      />
    </div>
  );
}
