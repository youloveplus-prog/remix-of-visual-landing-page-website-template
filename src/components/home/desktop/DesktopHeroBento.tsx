import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, GraduationCap, BookOpen, Bot, Cpu, Radio, ArrowUpRight } from "lucide-react";
import tutorImg from "@/assets/ai-tutor.webp";
import courseImg from "@/assets/course-ai-ml.webp";
import promptImg from "@/assets/prompt-library.webp";

export function DesktopHeroBento() {
  return (
    <section className="relative container-editorial pt-16 xl:pt-24 pb-12 xl:pb-20 overflow-hidden">
      {/* Ambient cinematic glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] rounded-full blur-[120px] opacity-60"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.22) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* Eyebrow pill */}
      <div className="relative z-10 flex justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-card/60 backdrop-blur text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground animate-fade-in">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Next-gen AI learning
        </div>
      </div>

      {/* Headline */}
      <div className="relative z-10 text-center mt-7 max-w-5xl mx-auto">
        <h1 className="font-display font-extrabold tracking-tighter leading-[0.9] text-6xl xl:text-8xl uppercase">
          <span className="block text-foreground">Master the art</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/30">
            of generation.
          </span>
        </h1>
        <p className="mt-7 text-lg xl:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          Asikon is the professional playground for high-fidelity AI education — from prompt
          engineering to latent-space exploration.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-foreground text-background text-sm font-semibold tracking-tight hover:bg-foreground/90 transition-all shadow-[0_10px_40px_-10px_hsl(var(--foreground)/0.4)]"
          >
            Start creating
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-card/40 border border-border/60 text-foreground text-sm font-semibold tracking-tight hover:bg-card/70 backdrop-blur-sm transition-all"
          >
            View curriculum
          </Link>
        </div>
      </div>

      {/* Cinematic bento */}
      <div className="relative z-10 mt-14 xl:mt-20 grid grid-cols-12 gap-4 min-h-[560px]">
        {/* Feature card — Neural Architecture */}
        <Link
          to="/learn"
          className="group relative col-span-12 lg:col-span-7 row-span-2 rounded-3xl overflow-hidden border border-border/60 bg-card"
        >
          <img
            src={tutorImg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -right-16 w-72 h-72 rounded-full blur-3xl"
            style={{ background: "hsl(var(--primary) / 0.25)" }}
          />
          <div className="absolute bottom-8 left-8 right-8 space-y-3">
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-primary">
              Featured track
            </span>
            <h3 className="font-display font-extrabold tracking-tight text-3xl xl:text-4xl text-foreground">
              Neural architecture
            </h3>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Deep-dive into diffusion models and structural consistency across modern
              generative workflows.
            </p>
            <div className="pt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/90">
              Enter the studio
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </Link>

        {/* Live workshops */}
        <Link
          to="/mentors"
          className="group relative col-span-12 lg:col-span-5 rounded-3xl overflow-hidden border border-border/60 bg-card p-7 flex flex-col justify-end min-h-[260px]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-70"
            style={{ background: "hsl(var(--primary) / 0.2)" }}
          />
          <div className="relative space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                <Radio className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground">
                Live · weekly
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground">
              Live workshops
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Daily sessions with leading prompt engineers and technical artists.
            </p>
          </div>
        </Link>

        {/* GPU cluster */}
        <Link
          to="/learn"
          className="group relative col-span-12 lg:col-span-5 rounded-3xl overflow-hidden border border-border/60 bg-card p-7 flex flex-col justify-end min-h-[260px]"
        >
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/[0.04] transition-colors" />
          <img
            src={promptImg}
            alt=""
            className="absolute -top-6 -right-6 w-44 h-44 object-cover opacity-30 rounded-full blur-xl"
          />
          <div className="relative space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center">
                <Cpu className="h-4 w-4 text-primary" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground">
                Infrastructure
              </span>
            </div>
            <h3 className="font-display font-bold text-2xl text-foreground">
              GPU cluster
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Cloud-based high-performance compute ready for your training runs.
            </p>
          </div>
        </Link>
      </div>

      {/* Stat tape */}
      <div className="relative z-10 mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60">
        {[
          { k: "120+", v: "Lessons" },
          { k: "14,802", v: "Students" },
          { k: "24/7", v: "AI tutor" },
          { k: "99.9%", v: "Uptime" },
        ].map((s) => (
          <div key={s.v} className="bg-card px-6 py-5 flex flex-col">
            <span className="font-display font-extrabold text-3xl tracking-tighter text-foreground tabular-nums">
              {s.k}
            </span>
            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted-foreground mt-1">
              {s.v}
            </span>
          </div>
        ))}
      </div>

      {/* Hidden seo-friendly secondary links */}
      <div className="sr-only">
        <Link to="/prompts">Prompt library</Link>
        <Link to="/shop?type=courses">Courses</Link>
        <Link to="/shop?type=books">Books</Link>
        <Link to="/profile">Profile</Link>
        <Sparkles aria-hidden /> <GraduationCap aria-hidden /> <BookOpen aria-hidden /> <Bot aria-hidden />
        <img src={courseImg} alt="" />
      </div>
    </section>
  );
}
