import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const MESSAGES = [
  "SKILL-UP FRIDAY · 50% OFF EVERY COURSE",
  "NEW · AI TUTOR NOW WITH VOICE",
  "FREE · 200+ PROMPTS LIBRARY",
  "JOIN · 1-ON-1 MENTOR WAITLIST",
];

/** Neon lime promo ticker — fixed, dense, marquee. */
export function NeonPromoTicker() {
  return (
    <Link
      to="/shop?filter=deals"
      className="hf-promo group relative flex h-9 w-full items-center overflow-hidden border-b border-white/10 bg-[hsl(var(--hf-accent))] text-white"
      aria-label="View today's offers"
    >
      <div className="flex min-w-max animate-[hf-marquee_28s_linear_infinite] items-center gap-10 px-6 text-[11px] font-semibold uppercase tracking-[0.18em]">
        {[...MESSAGES, ...MESSAGES, ...MESSAGES].map((m, i) => (
          <span key={i} className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {m}
          </span>
        ))}
      </div>
    </Link>
  );
}
