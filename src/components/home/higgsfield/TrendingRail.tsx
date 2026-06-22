import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export type TrendingItem = {
  id: string;
  title: string;
  image: string;
  meta?: string;
  to: string;
  /** Marks the card with the Gemini-style premium gradient treatment. */
  premium?: boolean;
};

/**
 * TrendingRail — applies a strict 60 / 30 / 10 colour rhythm:
 *   • 60%  pure black canvas (section bg + card body)
 *   • 30%  brand blue accents (hover ring, eyebrow line, meta tint)
 *   • 10%  white (title text + subtle hairlines)
 * Premium items get the Gemini sweep (blue → violet → magenta → peach)
 * applied as an animated gradient border + badge, so the premium signal
 * stays rare and unmistakable.
 */
export function TrendingRail({
  title,
  items,
  viewAllHref,
}: {
  title: string;
  items: TrendingItem[];
  viewAllHref?: string;
}) {
  if (!items.length) return null;
  return (
    <section className="hf-section relative bg-black text-white">
      {/* 30% brand-blue ambient wash — soft, never dominant */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-60"
        style={{
          background:
            "radial-gradient(60% 80% at 20% 0%, hsl(var(--brand-from) / 0.18) 0%, transparent 60%), radial-gradient(50% 70% at 90% 0%, hsl(268 80% 62% / 0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative mb-3 flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <div className="hf-eyebrow" style={{ ["--hf-accent" as never]: "var(--brand-from)" }}>
            Trending now
          </div>
          <h2 className="hf-title font-display text-white">{title}</h2>
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-[hsl(var(--brand-from))]"
          >
            View all →
          </Link>
        )}
      </div>

      <div className="scrollbar-hide relative overflow-x-auto">
        <div className="flex gap-3 px-4 pb-2 sm:px-6 lg:px-8">
          {items.map((it) => {
            const isPremium = !!it.premium;
            return (
              <Link
                key={it.id}
                to={it.to}
                className={[
                  "group relative block w-[220px] shrink-0 sm:w-[260px] rounded-[12px]",
                  isPremium ? "border-premium-gradient shadow-premium" : "",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative aspect-[3/4] overflow-hidden rounded-[10px] bg-black",
                    isPremium
                      ? "ring-0"
                      : "border border-white/10 transition-colors group-hover:border-[hsl(var(--brand-from)/0.55)]",
                  ].join(" ")}
                >
                  <img
                    src={it.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {/* 60% black scrim for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  {isPremium && (
                    <span
                      className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md"
                      style={{ boxShadow: "var(--shadow-premium)" }}
                    >
                      <Sparkles className="h-3 w-3 text-premium-gradient" strokeWidth={2.5} />
                      <span className="text-premium-gradient">Premium</span>
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <div
                    className={[
                      "line-clamp-2 text-[14px] font-semibold transition-colors",
                      isPremium
                        ? "text-white group-hover:text-premium-gradient"
                        : "text-white group-hover:text-[hsl(var(--brand-from))]",
                    ].join(" ")}
                  >
                    {it.title}
                  </div>
                  {it.meta && (
                    <div
                      className={[
                        "mt-0.5 text-[11px] uppercase tracking-[0.14em]",
                        isPremium ? "text-white/55" : "text-[hsl(var(--brand-from)/0.75)]",
                      ].join(" ")}
                    >
                      {it.meta}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
