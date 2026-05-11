import { Sparkles, Target, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export const ASIKON_MISSION = `ASIKON exists to make learning simple, smart, and accessible for every student. We focus on building an AI-powered education system that helps students learn faster, understand deeply, and stay motivated every day. Our mission is to remove the gap between traditional education and real-world skills by combining technology, teachers, and intelligent learning tools in one system. We want every learner to feel confident, independent, and future-ready.`;

export const ASIKON_VISION = `To become a leading AI-driven education ecosystem that transforms how students learn across Bangladesh and beyond. We imagine a future where every student has access to personalized learning, real guidance, and practical skills without barriers of location, cost, or system limitations. ASIKON will grow into a complete learning universe where education feels simple, powerful, and alive.`;

interface MissionVisionProps {
  variant?: "full" | "compact";
  className?: string;
}

export function MissionVision({ variant = "full", className }: MissionVisionProps) {
  if (variant === "compact") {
    return (
      <div className={cn("rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-4", className)}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary" />
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
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      <article className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
            <Target className="h-4 w-4 text-foreground" />
          </div>
          <h3 className="font-semibold text-base">Our Mission</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {ASIKON_MISSION}
        </p>
      </article>

      <article className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 to-primary/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
            <Eye className="h-4 w-4 text-foreground" />
          </div>
          <h3 className="font-semibold text-base">Our Vision</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {ASIKON_VISION}
        </p>
      </article>
    </div>
  );
}
