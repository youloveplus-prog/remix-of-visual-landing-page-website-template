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
      <div className="relative w-full mx-auto rounded-2xl lg:rounded-[1.75rem] p-4 sm:p-6 lg:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-md sm:max-w-lg md:max-w-none bg-[#f5f3ee] dark:bg-[#111110] border border-[#e8e4dd] dark:border-[#2a2a28]">
        <div className="grid gap-4 sm:gap-5 md:gap-7 md:grid-cols-[auto_1fr] md:items-center">
          {/* Identity + Greeting */}
          <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2 md:pr-6 md:border-r md:border-[#e8e4dd] dark:md:border-[#2a2a28]">
            <img
              src={logoImg}
              alt="Asikon"
              className="w-[clamp(3rem,calc(6vw+0.5rem),4rem)] h-[clamp(3rem,calc(6vw+0.5rem),4rem)] rounded-xl object-contain shrink-0"
            />
            <div className="min-w-0">
              <h2
                style={{ fontFamily: SERIF }}
                className="text-xl sm:text-2xl md:text-3xl tracking-tight leading-none text-[#0d0d0d] dark:text-[#f5f3ee]"
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
              <p
                style={{ fontFamily: SANS }}
                className="text-[11px] sm:text-xs mt-1 opacity-70 text-[#2d2d2d] dark:text-[#c8c4bc]"
              >
                Assalamu Alaikum! How can I help today?
              </p>
            </div>
          </div>

          {/* Composer + Suggestions */}
          <div className="min-w-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                go(q);
              }}
              className="relative"
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
                className="w-full rounded-xl py-3 sm:py-3.5 px-4 sm:px-5 pr-12 text-sm outline-none transition-all bg-white dark:bg-[#1a1a18] text-[#2d2d2d] dark:text-[#c8c4bc] border border-[#e8e4dd] dark:border-[#2a2a28] placeholder:text-[#2d2d2d]/40 dark:placeholder:text-[#c8c4bc]/40 focus:ring-1 focus:ring-[#0d0d0d] dark:focus:ring-[#f5f3ee]"
              />
              <button
                type="submit"
                aria-label="Send"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity bg-[#0d0d0d] dark:bg-[#f5f3ee] text-[#f5f3ee] dark:text-[#111110]"
              >
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </button>
            </form>

            <div className="overflow-hidden mt-3">
              <div
                className="flex gap-2 w-max"
                style={{ animation: "marquee 18s linear infinite" }}
              >
                {[...CHIPS, ...CHIPS].map((c, i) => (
                  <button
                    key={`${c.label}-${i}`}
                    type="button"
                    onClick={() => go(c.prompt)}
                    style={{ fontFamily: SANS }}
                    className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors text-center bg-white dark:bg-[#1a1a18] text-[#2d2d2d] dark:text-[#c8c4bc] border border-[#e8e4dd] dark:border-[#2a2a28] hover:border-[#0d0d0d] dark:hover:border-[#f5f3ee]"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <style>{`
                @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
