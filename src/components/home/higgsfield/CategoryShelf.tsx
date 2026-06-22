import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

/**
 * Higgsfield-style category gallery.
 * - Square cards with a coloured gradient + glyph
 * - Horizontal scroll-snap on mobile, responsive grid on desktop
 * - Hover lifts a corner arrow and brightens the gradient
 */
export function CategoryShelf() {
  const { data: categories, isLoading } = useCategories();
  const items = (categories ?? []) as Array<{
    id: string;
    slug: string;
    name: string;
    icon?: string;
    description?: string;
  }>;

  if (!isLoading && items.length === 0) return null;

  return (
    <section
      aria-label="Shop by category"
      className="hf-section hf-section-depth relative w-full bg-black"
    >
      {/* Header */}
      <header className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-[hsl(var(--hf-accent))]">
              Explore
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight leading-tight text-white">
              Shop by category
            </h2>
            <p className="mt-2 max-w-xl text-sm sm:text-[15px] text-white/55">
              Pick a path — every category bundles courses, services and digital
              products curated by ASIKON.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 transition hover:border-white/35 hover:bg-white/[0.08]"
          >
            All categories
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Mobile: scroll-snap row · Desktop: responsive grid */}
      <div className="mt-6 sm:mt-8">
        {/* Mobile */}
        <div
          className="hf-snap-row flex gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:hidden"
        >
          {(isLoading ? Array.from({ length: 6 }) : items).map((c: any, i) => (
            <CategoryCard
              key={c?.id ?? `sk-${i}`}
              category={c}
              index={i}
              loading={isLoading}
              // Wider basis (~82%) restores hero-presence now that cards are
              // shorter (5/3). Still leaves ~18% peek so the swipe affordance
              // is obvious. min-w ensures the card never collapses on very
              // narrow screens (≤320px).
              className="shrink-0 snap-start basis-[82%] min-w-[260px] max-w-[360px]"
            />
          ))}
        </div>

        {/* Desktop */}
        <div className="hidden sm:grid mx-auto max-w-[1400px] grid-cols-2 gap-3 px-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4 lg:px-8 xl:grid-cols-6">
          {(isLoading ? Array.from({ length: 6 }) : items).map((c: any, i) => (
            <CategoryCard
              key={c?.id ?? `sk-${i}`}
              category={c}
              index={i}
              loading={isLoading}
            />
          ))}
        </div>

        {/* Mobile-only "All" pill */}
        <div className="sm:hidden mt-4 px-4">
          <Link
            to="/shop"
            className="block w-full border border-white/15 bg-white/[0.04] py-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white/85 transition hover:border-white/35 hover:bg-white/[0.08]"
          >
            All categories
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── CategoryCard ─────────────── */

// Rotating gradient palette — one per card index, brand-indigo first.
const GRADIENTS = [
  "from-indigo-500/35 via-indigo-700/25 to-black",
  "from-fuchsia-500/30 via-purple-700/20 to-black",
  "from-emerald-500/30 via-teal-700/20 to-black",
  "from-amber-400/30 via-orange-600/20 to-black",
  "from-sky-500/30 via-blue-700/20 to-black",
  "from-rose-500/30 via-pink-700/20 to-black",
];

function CategoryCard({
  category,
  index,
  loading,
  className = "",
}: {
  category?: { id: string; slug: string; name: string; icon?: string; description?: string };
  index: number;
  loading?: boolean;
  className?: string;
}) {
  const gradient = GRADIENTS[index % GRADIENTS.length];

  if (loading || !category) {
    return (
      <div className={`hf-card-depth relative aspect-[5/3] sm:aspect-[4/3] border border-white/10 bg-neutral-900 ${className}`}>
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-white/[0.06]" />
      </div>
    );
  }

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      aria-label={category.name}
      className={`hf-card-depth group relative aspect-[5/3] sm:aspect-[4/3] overflow-hidden border border-white/10 bg-neutral-950 transition-colors hover:border-white/30 ${className}`}
    >
      {/* Gradient wash */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90 transition-opacity duration-500 group-hover:opacity-100`}
      />
      {/* Soft grain dots */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      {/* Spotlight on hover */}
      <div
        aria-hidden
        className="absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 20%, rgba(255,255,255,0.18) 0%, transparent 60%)",
        }}
      />

      {/* Glyph */}
      <div
        aria-hidden
        className="absolute left-4 top-4 grid h-11 w-11 place-items-center bg-white/10 text-2xl text-white backdrop-blur ring-1 ring-white/15 transition-transform duration-500 group-hover:-translate-y-0.5"
      >
        <span className="leading-none">{category.icon ?? "✦"}</span>
      </div>

      {/* Hover arrow */}
      <span className="absolute right-3 top-3 grid h-8 w-8 -translate-y-1 place-items-center bg-white/10 text-white opacity-0 ring-1 ring-white/15 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>

      {/* Label */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-display text-base sm:text-lg font-bold leading-tight text-white">
          {category.name}
        </h3>
        {category.description ? (
          <p className="mt-1 text-[12px] text-white/65 line-clamp-1">
            {category.description}
          </p>
        ) : (
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            Browse →
          </p>
        )}
      </div>
    </Link>
  );
}

export default CategoryShelf;
