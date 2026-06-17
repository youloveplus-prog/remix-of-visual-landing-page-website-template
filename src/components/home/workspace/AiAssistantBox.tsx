import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import aiTutor from "@/assets/ai-tutor.webp";

type Chip = { label: string; tag: string; prompt: string };

const ALL_CHIPS: Chip[] = [
  { tag: "Physics", label: "Explain SSC Physics", prompt: "Explain SSC Physics" },
  { tag: "Planner", label: "Make a study plan", prompt: "Make a study plan" },
  { tag: "Math", label: "Quiz me on HSC Math", prompt: "Quiz me on HSC Math" },
  { tag: "Reading", label: "Summarise a chapter", prompt: "Summarise a chapter" },
  { tag: "Grammar", label: "English grammar help", prompt: "Help me with English grammar" },
  { tag: "Science", label: "The water cycle", prompt: "Explain the water cycle" },
  { tag: "Biology", label: "Photosynthesis 101", prompt: "What is photosynthesis?" },
  { tag: "Vocab", label: "Memorise vocabulary", prompt: "Help me memorise vocabulary" },
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
      <div
        className="relative w-full rounded-[24px] border border-primary/10 bg-card shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.18)] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-primary/15 shadow-md shadow-primary/10">
                <SmartImage
                  src={aiTutor}
                  alt="Asikon AI tutor"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                aria-hidden
                className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-[3px] ring-card"
              />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[17px] leading-tight tracking-tight text-foreground truncate">
                Asikon AI
              </p>
              <p className="font-dot text-[10px] tracking-[0.14em] uppercase text-primary/80 leading-tight mt-0.5">
                Bilingual Tutor · Online
              </p>
            </div>
          </div>
        </div>

        {/* Welcome bubble */}
        <div className="px-5 pt-4">
          <div className="rounded-2xl bg-muted/50 px-4 py-3 border border-border/60">
            <p className="text-[13px] leading-relaxed text-foreground/80">
              <span className="font-bangla">আসসালামু আলাইকুম!</span> Pick a topic below or ask me anything in Bangla or English.
            </p>
          </div>
        </div>

        {/* Suggestion chips — 2x2 grid */}
        <div className="px-5 pt-3 grid grid-cols-2 gap-2">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => go(c.prompt)}
              className="group text-left rounded-xl border border-primary/10 bg-background/40 px-3 py-2.5 hover:border-primary/50 hover:bg-primary/[0.04] transition-all"
            >
              <p className="font-dot text-[9.5px] tracking-[0.14em] uppercase text-primary/60 group-hover:text-primary leading-none mb-1.5">
                {c.tag}
              </p>
              <p className="text-[12.5px] font-semibold text-foreground leading-tight truncate">
                {c.label}
              </p>
            </button>
          ))}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go(q);
          }}
          className="m-5 mt-4 relative flex items-center rounded-2xl bg-muted/60 border border-transparent focus-within:border-primary/30 focus-within:bg-muted/80 transition-all p-1.5 pl-1"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask anything…"
            aria-label="Ask Asikon AI"
            className="flex-1 bg-transparent px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="submit"
            aria-label="Send"
            className="shrink-0 h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-md shadow-primary/25 hover:scale-105 active:scale-95 transition-transform"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </section>
  );
}
