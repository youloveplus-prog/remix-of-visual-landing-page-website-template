import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logoImg from "@/assets/logo.png";

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
        className="relative w-full mx-auto rounded-xl sm:rounded-2xl lg:rounded-[2rem] p-5 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none bg-[#f5f3ee] dark:bg-[#111110] border border-[#e8e4dd] dark:border-[#2a2a28]"
      >
        {/* Identity */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <img
            src={logoImg}
            alt="Asikon"
            className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl object-contain shrink-0"
          />
          <h2
            style={{ fontFamily: SERIF }}
            className="text-2xl sm:text-3xl md:text-4xl tracking-tight leading-none text-[#0d0d0d] dark:text-[#f5f3ee]"
          >
            {"Asikon AI".split("").map((ch, i) => (
              <span
                key={i}
                className="inline-block animate-fade-in"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h2>
        </div>

        {/* Greeting */}
        <div className="mb-6 sm:mb-8 text-center">
          <p
            style={{ fontFamily: SANS }}
            className="text-2xl sm:text-3xl md:text-4xl font-light leading-relaxed text-[#0d0d0d] dark:text-[#f5f3ee]"
          >
            Assalamu Alaikum!
          </p>
          <p
            style={{ fontFamily: SANS }}
            className="text-sm sm:text-base mt-2 opacity-80 text-[#2d2d2d] dark:text-[#c8c4bc]"
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
          className="relative mb-6 sm:mb-8"
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
            style={{ fontFamily: SANS }}
            className="w-full rounded-2xl py-3.5 sm:py-4 px-5 sm:px-6 pr-14 text-sm sm:text-base outline-none transition-all bg-white dark:bg-[#1a1a18] text-[#2d2d2d] dark:text-[#c8c4bc] border border-[#e8e4dd] dark:border-[#2a2a28] placeholder:text-[#2d2d2d]/40 dark:placeholder:text-[#c8c4bc]/40 focus:ring-1 focus:ring-[#0d0d0d] dark:focus:ring-[#f5f3ee]"
          />
          <button
            type="submit"
            aria-label="Send"
            className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity bg-[#0d0d0d] dark:bg-[#f5f3ee] text-[#f5f3ee] dark:text-[#111110]"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
          </button>
        </form>

        {/* Suggestions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {CHIPS.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => go(c.prompt)}
              style={{ fontFamily: SANS }}
              className="flex items-center justify-center px-3 py-3 sm:py-3.5 text-[11px] sm:text-xs font-medium rounded-xl transition-colors text-center bg-white dark:bg-[#1a1a18] text-[#2d2d2d] dark:text-[#c8c4bc] border border-[#e8e4dd] dark:border-[#2a2a28] hover:border-[#0d0d0d] dark:hover:border-[#f5f3ee]"
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
