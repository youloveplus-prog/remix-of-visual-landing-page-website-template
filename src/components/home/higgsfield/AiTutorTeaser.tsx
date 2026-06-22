import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";

const BUBBLES = [
  { role: "user", text: "Explain backpropagation like I'm 12." },
  { role: "ai", text: "Imagine a chef tasting soup, then walking back through each step to fix the seasoning…" },
  { role: "user", text: "Now give me a tiny Python example." },
  { role: "ai", text: "Sure — here's a 10-line numpy version with comments. Want me to quiz you after?" },
];

export function AiTutorTeaser() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10">
      <div className="grid grid-cols-1 gap-3 overflow-hidden rounded-[12px] border border-white/10 bg-neutral-950 lg:grid-cols-2">
        <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--hf-accent))]">
            <Sparkles className="h-3.5 w-3.5" /> AI Tutor
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
            A patient teacher who never sleeps.
          </h2>
          <p className="mt-3 max-w-md text-[14px] text-white/55">
            Ask anything — code, concepts, homework — in text or voice. Get answers tuned to your level, with quizzes and recaps built in.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/learn"
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[hsl(var(--hf-accent))] px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:opacity-90"
            >
              Ask now <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/prompts"
              className="inline-flex h-10 items-center rounded-md border border-white/15 px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white hover:border-white/40"
            >
              Browse prompts
            </Link>
          </div>
        </div>
        <div className="space-y-2 p-6 sm:p-8">
          {BUBBLES.map((b, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] ${
                b.role === "user"
                  ? "ml-auto bg-white/10 text-white"
                  : "border border-white/10 bg-black text-white/80"
              }`}
            >
              {b.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
