import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Play, GraduationCap, Trophy, BookOpen, Flame } from "lucide-react";

/**
 * WarmBentoHero — warm cream + indigo bento-style hero for the homepage.
 * Uses semantic tokens only (bg-background, text-foreground, primary, chip.*).
 */
export const WarmBentoHero = () => {
  return (
    <section className="section-x">
      <div className="rounded-[28px] bg-chip-cream border border-border/60 p-3 sm:p-4 shadow-[0_18px_60px_-30px_hsl(var(--primary)/0.35)]">
        <div className="grid grid-cols-6 auto-rows-[minmax(0,1fr)] gap-3 sm:gap-4">
          {/* Eyebrow / brand row */}
          <div className="col-span-6 flex items-center justify-between px-1">
            <span className="font-dot text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              ASIKON · Learn smarter
            </span>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1 font-dot text-[10px] uppercase tracking-[0.22em] text-foreground/70 hover:text-primary transition-colors"
            >
              Browse all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Hero headline tile — indigo */}
          <div className="col-span-6 lg:col-span-4 row-span-2 relative overflow-hidden rounded-[24px] bg-primary text-primary-foreground p-6 sm:p-8 min-h-[260px] sm:min-h-[320px] flex flex-col justify-between">
            <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_0%_100%,hsl(0_0%_0%/0.25),transparent_60%)]" />

            <div className="relative z-10 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]">
                <Sparkles className="h-3 w-3" /> New · AI Tutor 24/7
              </span>
            </div>

            <div className="relative z-10">
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl leading-[1.05] tracking-tight">
                Master AI &amp; modern skills,<br className="hidden sm:block" /> one warm lesson at a time.
              </h1>
              <p className="mt-3 sm:mt-4 max-w-md text-sm sm:text-base text-primary-foreground/85">
                Expert courses, instant AI feedback, and a friendly community — all in one calm space.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <Link
                  to="/shop#products"
                  className="inline-flex items-center gap-1.5 rounded-full bg-background text-foreground px-4 py-2.5 text-sm font-semibold shadow-[0_8px_20px_-8px_hsl(0_0%_0%/0.35)] hover:-translate-y-0.5 transition-transform"
                >
                  Start learning <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/learn"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/30 px-4 py-2.5 text-sm font-semibold hover:bg-white/25 transition-colors"
                >
                  <Play className="h-4 w-4" /> Watch demo
                </Link>
              </div>
            </div>
          </div>

          {/* Stat tile — butter */}
          <div className="col-span-3 lg:col-span-2 rounded-[24px] bg-chip-butter p-5 flex flex-col justify-between min-h-[150px]">
            <span className="font-dot text-[10px] uppercase tracking-[0.22em] text-foreground/60">Learners</span>
            <div>
              <p className="font-display font-extrabold text-3xl sm:text-4xl tabular-nums text-foreground">12k+</p>
              <p className="text-xs text-foreground/70 mt-1">Active this month</p>
            </div>
          </div>

          {/* Action tile — lavender */}
          <Link
            to="/learn"
            className="col-span-3 lg:col-span-2 group relative rounded-[24px] bg-chip-lavender p-5 flex flex-col justify-between min-h-[150px] hover:-translate-y-0.5 transition-transform"
          >
            <div className="flex items-center justify-between">
              <span className="font-dot text-[10px] uppercase tracking-[0.22em] text-foreground/60">AI Tutor</span>
              <span className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.7)]">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <p className="font-display font-bold text-base text-foreground leading-tight">Ask anything,<br/>get answers</p>
              <ArrowUpRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </Link>

          {/* Bottom row chips */}
          <Link
            to="/shop?type=courses"
            className="col-span-2 group rounded-[20px] bg-background border border-border/60 p-4 flex items-center gap-3 hover:border-primary/40 hover:-translate-y-0.5 transition-all min-h-[80px]"
          >
            <span className="w-9 h-9 rounded-xl bg-chip-mint flex items-center justify-center text-foreground">
              <GraduationCap className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">Courses</p>
              <p className="font-dot text-[9px] uppercase tracking-[0.22em] text-muted-foreground">120+ lessons</p>
            </div>
          </Link>

          <Link
            to="/leaderboard"
            className="col-span-2 group rounded-[20px] bg-background border border-border/60 p-4 flex items-center gap-3 hover:border-primary/40 hover:-translate-y-0.5 transition-all min-h-[80px]"
          >
            <span className="w-9 h-9 rounded-xl bg-chip-butter flex items-center justify-center text-foreground">
              <Trophy className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">Leaderboard</p>
              <p className="font-dot text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Climb daily</p>
            </div>
          </Link>

          <Link
            to="/shop?type=ebooks"
            className="col-span-1 group rounded-[20px] bg-background border border-border/60 p-4 flex items-center justify-center hover:border-primary/40 hover:-translate-y-0.5 transition-all min-h-[80px]"
            aria-label="Books"
          >
            <span className="w-9 h-9 rounded-xl bg-chip-lavender flex items-center justify-center text-foreground">
              <BookOpen className="h-4 w-4" />
            </span>
          </Link>

          <Link
            to="/shop?filter=trending"
            className="col-span-1 group rounded-[20px] bg-primary/10 border border-primary/20 p-4 flex items-center justify-center hover:bg-primary/15 hover:-translate-y-0.5 transition-all min-h-[80px]"
            aria-label="Trending"
          >
            <span className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
              <Flame className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WarmBentoHero;
