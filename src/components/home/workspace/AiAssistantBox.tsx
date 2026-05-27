import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
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
      <div className="relative overflow-hidden rounded-3xl border-2 border-black bg-[#f6f5f0] p-4 shadow-[5px_5px_0_0_rgba(0,0,0,1)]">
        {/* Identity row */}
        <div className="relative flex items-center gap-3 mb-3">
          <div className="relative shrink-0">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <SmartImage
                src={aiTutor}
                alt="Asikon AI tutor"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-black" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-grotesk font-black text-[15px] leading-tight tracking-tight flex items-center gap-1.5">
              Asikon AI <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
            </p>
            <p className="text-[10px] text-black/60 font-bold uppercase tracking-wider leading-tight mt-0.5">Online · Bangla & English</p>
          </div>
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => { e.preventDefault(); go(q); }}
          className="relative flex items-center gap-2 rounded-2xl border-2 border-black bg-white p-1.5 shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask Asikon AI anything…"
            className="h-9 flex-1 bg-transparent border-0 shadow-none focus-visible:ring-0 text-[14px] px-2"
          />
          <button
            type="submit"
            aria-label="Ask"
            className="h-9 w-9 shrink-0 rounded-xl bg-primary text-primary-foreground border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
          </button>
        </form>

        {/* Suggestion chips */}
        <div className="relative mt-3 -mx-1 px-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 w-max">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => go(c)}
                className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full border-2 border-black bg-white text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5"
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
