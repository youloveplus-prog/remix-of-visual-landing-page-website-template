import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import aiTutor from "@/assets/ai-tutor.jpg";

const ALL_CHIPS = [
  "Explain SSC Physics",
  "Make a study plan",
  "Quiz me on HSC Math",
  "Summarise a chapter",
  "Help me with English grammar",
  "Explain the water cycle",
  "What is photosynthesis?",
  "Help me memorise vocabulary",
];

export function AiAssistantBox() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const CHIPS = useMemo(() => {
    const shuffled = [...ALL_CHIPS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, []);
  const go = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return nav("/learn");
    nav(`/learn?q=${encodeURIComponent(trimmed)}`);
  };
  return (
    <section className="section-x">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-foreground/[0.05] via-foreground/[0.015] to-transparent p-4">
        {/* Soft identity glow behind avatar */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-12 -left-6 h-40 w-40 rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(circle, hsl(var(--foreground)/0.10), transparent 70%)" }}
        />

        {/* Identity row */}
        <div className="relative flex items-center gap-3 mb-3">
          <div className="relative shrink-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-border">
              <SmartImage
                src={aiTutor}
                alt="Asikon AI tutor"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display font-semibold text-[15px] leading-tight tracking-tight">Asikon AI</p>
            <p className="text-[11.5px] text-muted-foreground leading-tight">Online · Bangla & English</p>
          </div>
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => { e.preventDefault(); go(q); }}
          className="relative flex items-center gap-2 rounded-2xl border border-border bg-background/70 backdrop-blur-sm p-1.5 focus-within:border-foreground/40 transition-colors"
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask Asikon AI anything…"
            className="h-9 flex-1 bg-transparent border-0 shadow-none focus-visible:ring-0 text-[14px] px-2"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Ask"
            className="h-9 w-9 shrink-0 rounded-xl bg-foreground text-background hover:bg-foreground/90"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </form>

        {/* Suggestion chips */}
        <div className="relative mt-3 -mx-1 px-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-1.5 w-max">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => go(c)}
                className="shrink-0 text-[11.5px] px-3 py-1.5 rounded-full border border-border bg-background/40 hover:border-foreground/40 hover:bg-secondary transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
