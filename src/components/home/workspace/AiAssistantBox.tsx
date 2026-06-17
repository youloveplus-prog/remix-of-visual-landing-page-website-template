import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type Chip = { label: string; prompt: string };

const ALL_CHIPS: Chip[] = [
  { label: "HSC English Help", prompt: "Help me with HSC English" },
  { label: "বাংলা ব্যাকরণ", prompt: "বাংলা ব্যাকরণে সাহায্য করো" },
  { label: "Math Problem Solver", prompt: "Solve a math problem" },
  { label: "সাধারণ জ্ঞান", prompt: "সাধারণ জ্ঞান নিয়ে প্রশ্ন কর" },
  { label: "Explain Grammar", prompt: "Explain English grammar" },
  { label: "Study Roadmap", prompt: "Make me a study roadmap" },
  { label: "Photosynthesis 101", prompt: "What is photosynthesis?" },
  { label: "Memorise Vocabulary", prompt: "Help me memorise vocabulary" },
];

// Paper & Ink palette — locked, scoped to this card
const SURFACE = "#f5f3ee";
const HAIRLINE = "#e8e4dd";
const INK = "#2d2d2d";
const DEEP = "#0d0d0d";

const SERIF = "'DM Serif Display', ui-serif, Georgia, serif";
const SANS = "'Fira Sans', ui-sans-serif, system-ui, sans-serif";

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
        className="relative w-full max-w-md mx-auto rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]"
        style={{
          backgroundColor: SURFACE,
          border: `1px solid ${HAIRLINE}`,
        }}
      >
        {/* Identity */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: DEEP }}
            aria-hidden
          >
            <span
              style={{ fontFamily: SERIF, color: SURFACE }}
              className="text-2xl leading-none"
            >
              A
            </span>
          </div>
          <h2
            style={{ fontFamily: SERIF, color: DEEP }}
            className="text-2xl tracking-tight text-center"
          >
            Asikon AI
          </h2>
          <p
            style={{ fontFamily: SANS, color: INK }}
            className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1"
          >
            Bilingual Tutor Assistant
          </p>
        </div>

        {/* Greeting */}
        <div className="mb-8 text-center">
          <p
            style={{ fontFamily: SANS, color: DEEP }}
            className="text-2xl font-light leading-relaxed font-bangla"
          >
            আসসালামু আলাইকুম!
          </p>
          <p
            style={{ fontFamily: SANS, color: INK }}
            className="text-sm mt-2 opacity-80"
          >
            How can I help you with your studies today?
          </p>
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            go(q);
          }}
          className="relative mb-10"
        >
          <label htmlFor="asikon-ask" className="sr-only">
            Ask Asikon AI
          </label>
          <input
            id="asikon-ask"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask anything in Bangla or English..."
            style={{
              fontFamily: SANS,
              color: INK,
              backgroundColor: "#ffffff",
              border: `1px solid ${HAIRLINE}`,
            }}
            className="w-full rounded-2xl py-4 px-6 pr-14 outline-none transition-all placeholder:opacity-40 focus:ring-1"
          />
          <button
            type="submit"
            aria-label="Send"
            style={{ backgroundColor: DEEP, color: SURFACE }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </form>

        {/* Suggestions */}
        <div className="grid grid-cols-2 gap-3">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => go(c.prompt)}
              style={{
                fontFamily: SANS,
                color: INK,
                backgroundColor: "#ffffff",
                border: `1px solid ${HAIRLINE}`,
              }}
              className="flex items-center justify-center p-3 text-xs font-medium rounded-xl transition-colors hover:[border-color:#0d0d0d]"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
