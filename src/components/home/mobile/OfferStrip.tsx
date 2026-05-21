import { Link } from "react-router-dom";
import { Gift, ArrowUpRight, Flame } from "lucide-react";

export function OfferStrip() {
  return (
    <section className="section-x">
      <div className="flex items-end justify-between mb-2">
        <h2 className="font-semibold text-base">Today's Offers</h2>
        <Link to="/shop?filter=deals" className="text-xs text-primary font-medium">See all</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/shop?filter=deals"
          className="group relative overflow-hidden rounded-2xl p-4 border border-primary/30 pressable focus-ring"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="absolute -right-6 -bottom-6 opacity-20">
            <Gift className="h-32 w-32 text-primary-foreground" />
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-background/25 backdrop-blur text-primary-foreground mb-2">
            <Flame className="h-3 w-3" /> Limited
          </span>
          <h3 className="font-display text-lg font-bold text-primary-foreground leading-tight">
            50% Off — Skill-Up Friday
          </h3>
          <p className="text-xs text-primary-foreground/85 mt-1 max-w-[220px]">
            Top-rated courses & books at half price. Ends tonight.
          </p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary-foreground">
            Grab the deal
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          to="/prompts"
          className="group relative overflow-hidden rounded-2xl p-4 glass border border-border/60 pressable focus-ring"
        >
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Gift className="h-28 w-28 text-primary" />
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 mb-2">
            Free
          </span>
          <h3 className="font-display text-lg font-bold leading-tight">
            1000+ AI Prompts — Free
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
            Boost productivity with our curated prompt library.
          </p>
          <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary">
            Get the library
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </Link>
      </div>
    </section>
  );
}
