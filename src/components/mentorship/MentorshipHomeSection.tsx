import { Link } from "react-router-dom";
import { GraduationCap, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MentorshipHomeSection() {
  return (
    <section className="section-x">
      <div
        className="relative overflow-hidden rounded-3xl border border-primary/30 px-5 py-5 lg:px-8 lg:py-6"
        style={{ background: "var(--gradient-primary)" }}
      >
        {/* Ambient glow accents (subtle) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(0 0% 100% / 0.35), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(0 0% 100% / 0.25), transparent 70%)" }}
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Icon chip */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
              <GraduationCap className="h-6 w-6 lg:h-7 lg:w-7 text-primary-foreground" />
            </div>
            <span className="lg:hidden inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm text-primary-foreground text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 border border-white/20">
              For parents
            </span>
          </div>

          {/* Copy */}
          <div className="flex-1 min-w-0">
            <span className="hidden lg:inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm text-primary-foreground text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 border border-white/20 mb-2">
              For parents
            </span>
            <h2 className="font-display font-bold text-lg lg:text-2xl leading-tight tracking-tight text-primary-foreground">
              Find a trusted home tutor for your child.
            </h2>
            <p className="text-sm lg:text-[15px] text-primary-foreground/85 mt-1.5 leading-relaxed max-w-2xl">
              Book a free demo class today, meet a background-checked teacher, and only continue if it feels right for your family.
            </p>
          </div>

          {/* CTA */}
          <div className="lg:shrink-0">
            <Button asChild variant="secondary" size="lg" className="w-full lg:w-auto shadow-lg">
              <Link to="/mentors" className="inline-flex items-center justify-center gap-1.5">
                Book a free demo
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
