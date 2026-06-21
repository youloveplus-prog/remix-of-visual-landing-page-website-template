import { Link } from "react-router-dom";
import { Link2, ArrowRight, Sparkles, GraduationCap, BookOpen, Bot, Plus, Settings, Gem } from "lucide-react";
import tutorImg from "@/assets/ai-tutor.webp";
import courseImg from "@/assets/course-ai-ml.jpg";
import promptImg from "@/assets/prompt-library.jpg";

function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-foreground shadow-sm">
      {children}
    </div>
  );
}

export function DesktopHeroBento() {
  return (
    <section className="container-editorial py-10 xl:py-14">
      {/* Eyebrow + headline */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">
          AI-powered learning, made simple with ASIKON.
        </p>
        <h1 className="font-display font-bold tracking-tight text-5xl xl:text-6xl text-foreground leading-[1.05]">
          Master AI, Python &amp;<br />
          modern skills today.
        </h1>
      </div>

      {/* Search */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 bg-card rounded-full pl-5 pr-2 py-2 border border-border shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.25)]">
          <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Drop a topic, course, or skill..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground py-2"
          />
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_6px_20px_-8px_hsl(var(--primary)/0.6)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start learning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Bento */}
      <div className="mt-10 grid grid-cols-3 grid-rows-2 gap-5 min-h-[480px]">
        {/* Drop a Link — yellow */}
        <Link
          to="/learn"
          className="relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between bg-[hsl(var(--chip-butter))] text-foreground hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3">
            <IconChip><Link2 className="h-4 w-4" /></IconChip>
            <h3 className="font-display font-bold text-lg">Drop a Link</h3>
          </div>
          <div className="flex items-center gap-2 surface-panel rounded-full pl-4 pr-1 py-1 shadow-sm">
            <Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground flex-1 truncate">Paste any course url...</span>
            <span className="inline-flex items-center rounded-full bg-foreground text-background px-3 py-1.5 text-[11px] font-semibold">
              Boost
            </span>
          </div>
        </Link>

        {/* Create Avatar — mint, tall, spans 2 rows */}
        <Link
          to="/learn"
          className="relative overflow-hidden rounded-3xl p-6 row-span-2 bg-[hsl(var(--chip-mint))] text-foreground flex flex-col hover:scale-[1.005] transition-transform"
        >
          <div className="flex items-center gap-3 relative z-10">
            <IconChip><Gem className="h-4 w-4" /></IconChip>
            <h3 className="font-display font-bold text-lg leading-tight">
              Meet your<br />AI Tutor
            </h3>
          </div>
          <img
            src={tutorImg}
            alt=""
            className="absolute inset-x-0 bottom-0 w-full h-[80%] object-cover object-top opacity-90 mix-blend-luminosity"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[hsl(var(--chip-mint))] to-transparent" />
          <div className="mt-auto relative z-10 flex items-center justify-between">
            <div className="flex -space-x-2">
              {[tutorImg, courseImg, promptImg].map((src, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-[hsl(var(--chip-mint))] overflow-hidden surface-panel">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Use a Preset — lavender */}
        <Link
          to="/prompts"
          className="relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between bg-[hsl(var(--chip-lavender))] text-foreground hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3">
            <IconChip><Sparkles className="h-4 w-4" /></IconChip>
            <h3 className="font-display font-bold text-lg">Use a Preset</h3>
          </div>
          <div className="surface-panel rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <Bot className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-1.5 rounded-full bg-muted w-3/4" />
              <div className="h-1.5 rounded-full bg-muted w-1/2" />
              <div className="h-1.5 rounded-full bg-muted w-2/3" />
            </div>
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        </Link>

        {/* Use Template — sky */}
        <Link
          to="/shop?type=courses"
          className="relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between bg-primary/10 text-foreground hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3">
            <IconChip><BookOpen className="h-4 w-4" /></IconChip>
            <h3 className="font-display font-bold text-lg">Use Template</h3>
          </div>
          <div className="relative surface-panel rounded-2xl p-2 flex items-center gap-2 shadow-sm">
            <img src={courseImg} alt="" className="w-14 h-14 rounded-xl object-cover" />
            <div className="flex-1 space-y-1.5">
              <div className="h-1.5 rounded-full bg-muted w-3/4" />
              <div className="h-1.5 rounded-full bg-muted w-1/2" />
              <div className="h-1.5 rounded-full bg-muted w-2/3" />
            </div>
            <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center">
              <Plus className="h-3.5 w-3.5" />
            </div>
          </div>
        </Link>

        {/* Connect Account — yellow */}
        <Link
          to="/profile"
          className="relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between bg-[hsl(var(--chip-butter))] text-foreground hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center gap-3">
            <IconChip><GraduationCap className="h-4 w-4" /></IconChip>
            <h3 className="font-display font-bold text-lg">Track Progress</h3>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="rounded-full surface-panel text-foreground px-4 py-2 text-sm font-semibold shadow-sm">
              Connect
            </span>
            <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center">
              <Plus className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
