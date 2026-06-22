import { Link } from "react-router-dom";
import { Bot, Sparkles, MessageSquare, Mic, Code2, BookOpen } from "lucide-react";

export function SuperagentBand() {
  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[24px] border border-white/10 bg-black">
        {/* Indigo radial glow background */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 110%, hsl(var(--hf-accent)) 0%, rgba(59,79,224,0.55) 25%, rgba(15,18,40,0.95) 60%, #000 100%)",
          }}
        />
        {/* Grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(transparent 95%, rgba(255,255,255,0.07) 95%), linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.07) 95%)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(80% 60% at 50% 100%, black 0%, transparent 75%)",
          }}
        />
        {/* Grain */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />

        <div className="relative grid min-h-[520px] grid-cols-12 gap-4 p-6 sm:p-10 lg:p-14">
          {/* Floating card: Tutor chat (left) */}
          <div className="hidden lg:col-span-3 lg:flex lg:flex-col lg:justify-center">
            <div className="rotate-[-3deg] rounded-2xl border border-white/15 bg-black/55 p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="flex items-center gap-2 px-1 pb-2">
                <Bot className="h-3.5 w-3.5 text-[hsl(var(--hf-accent))]" />
                <span className="text-[11px] font-semibold text-white">AI Tutor</span>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg bg-white/[0.06] p-2 text-[11px] text-white/80">
                  Explain backprop in 3 lines.
                </div>
                <div className="rounded-lg bg-[hsl(var(--hf-accent))]/90 p-2 text-[11px] leading-snug text-white">
                  It's the chain rule run backwards through a network…
                </div>
                <div className="flex items-center gap-1 pt-1">
                  <Mic className="h-3 w-3 text-white/50" />
                  <div className="flex gap-0.5">
                    {[3, 6, 4, 8, 5, 7, 3].map((h, i) => (
                      <span
                        key={i}
                        className="block w-0.5 rounded-full bg-white/60"
                        style={{ height: `${h * 2}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center stage */}
          <div className="col-span-12 flex flex-col items-center justify-center text-center lg:col-span-6">
            {/* Stacked icon cubes */}
            <div className="mb-6 flex -space-x-3">
              {[BookOpen, Code2, Sparkles, Bot, MessageSquare].map((I, i) => (
                <div
                  key={i}
                  className={`grid h-12 w-12 place-items-center rounded-xl border border-white/15 bg-neutral-900/80 text-white shadow-xl backdrop-blur ${
                    i === 2 ? "z-10 scale-110 bg-[hsl(var(--hf-accent))] border-white/30" : ""
                  }`}
                  style={{ transform: `rotate(${(i - 2) * 6}deg) translateY(${Math.abs(i - 2) * 4}px)` }}
                >
                  <I className="h-5 w-5" />
                </div>
              ))}
            </div>

            <h2 className="font-display text-5xl font-extrabold uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
              SUPER<span className="text-[hsl(var(--hf-accent))]">TUTOR</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/70 sm:text-base">
              One AI companion for every subject — courses, prompts, mentors and your own
              learning journey, in one place.
            </p>
            <Link
              to="/learn"
              className="mt-7 inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-10px_hsl(var(--hf-accent))]"
            >
              Try SuperTutor
            </Link>
          </div>

          {/* Floating card: Mentor / progress (right) */}
          <div className="hidden lg:col-span-3 lg:flex lg:flex-col lg:justify-center">
            <div className="rotate-[3deg] rounded-2xl border border-white/15 bg-black/55 p-3 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <div className="flex items-center gap-2 px-1 pb-2">
                <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--hf-accent))]" />
                <span className="text-[11px] font-semibold text-white">Mentor</span>
                <span className="ml-auto text-[9px] font-medium text-white/50">
                  Today
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] p-2">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[hsl(var(--hf-accent))] to-fuchsia-500 text-[10px] font-bold text-white">
                  AR
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-white">Ariana R.</div>
                  <div className="text-[9px] text-white/50">Python · Kids 8-14</div>
                </div>
              </div>
              <div className="mt-2 rounded-lg border border-white/10 bg-black/40 p-2">
                <div className="flex items-center justify-between text-[10px] text-white/60">
                  <span>Track progress</span>
                  <span className="text-white">68%</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-[hsl(var(--hf-accent))]" />
                </div>
              </div>
            </div>

            {/* Floating chip */}
            <div className="ml-auto mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-semibold text-white shadow-xl backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--hf-accent))]" />
              Learning
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
