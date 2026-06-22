import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import type { ProductKind } from "@/types";

type Props = {
  title: string;
  eyebrow?: string;
  description?: string;
  kinds: ProductKind[];
  viewAllHref: string;
  /** Optional muted video URL shown on the first / featured card. */
  featuredVideo?: string;
  /** Tailwind text color class for the eyebrow accent. */
  accent?: string;
};

export function ProductShowcase({
  title,
  eyebrow,
  description,
  kinds,
  viewAllHref,
  featuredVideo,
  accent = "text-[hsl(var(--hf-accent))]",
}: Props) {
  const { data: products = [] } = useProducts({ kinds, limit: 8 });

  if (products.length === 0) return null;

  return (
    <section
      aria-label={title}
      className="relative w-full bg-black py-12 sm:py-16"
    >
      {/* Header */}
      <header className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && (
              <p
                className={`mb-2 font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] ${accent}`}
              >
                {eyebrow}
              </p>
            )}
            <h2 className="font-display text-2xl sm:text-3xl lg:text-[40px] font-bold leading-[1.05] tracking-tight text-white">
              {title}
            </h2>
            {description && (
              <p className="mt-2 max-w-xl text-sm sm:text-[15px] text-white/55">
                {description}
              </p>
            )}
          </div>
          <Link
            to={viewAllHref}
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 transition hover:border-white/35 hover:bg-white/[0.08]"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Horizontal scroll row */}
      <div
        className="mt-6 sm:mt-8 flex gap-3 sm:gap-4 overflow-x-auto overscroll-x-contain px-4 sm:px-6 lg:px-8 pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
        style={{ scrollPaddingLeft: "1rem" }}
      >
        {products.map((p, i) => {
          const isFeatured = i === 0 && Boolean(featuredVideo);
          return (
            <Link
              key={p.id}
              to={`/product/${p.slug ?? p.id}`}
              className="group relative shrink-0 snap-start basis-[78%] sm:basis-[42%] lg:basis-[28%] xl:basis-[23%]"
              aria-label={p.name}
            >
              <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden border border-white/10 bg-neutral-900">
                {isFeatured ? (
                  <video
                    src={featuredVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={p.image_url}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <img
                    src={p.image_url || "/placeholder.svg"}
                    alt=""
                    loading={i < 2 ? "eager" : "lazy"}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    draggable={false}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Kind chip */}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 bg-black/65 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                  <span className={`h-1.5 w-1.5 rounded-full bg-current ${accent}`} />
                  {labelForKind(p.kind)}
                </span>

                {/* Play icon for course featured tile */}
                {isFeatured && (
                  <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center bg-white/10 text-white backdrop-blur ring-1 ring-white/20">
                    <Play className="h-4 w-4 fill-current" />
                  </span>
                )}

                {/* Caption block */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <h3 className="font-display text-[15px] sm:text-[17px] font-bold leading-tight text-white line-clamp-2">
                    {p.name}
                  </h3>
                  <div className="mt-1.5 flex items-baseline justify-between gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">
                      {p.category || labelForKind(p.kind)}
                    </span>
                    <span className="font-display text-sm font-semibold text-white tabular-nums">
                      ৳{Number(p.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* Mobile "View all" tile at end */}
        <Link
          to={viewAllHref}
          className="sm:hidden grid shrink-0 snap-start basis-[40%] place-items-center border border-white/15 bg-white/[0.04] text-white/80 hover:border-white/35 hover:bg-white/[0.08] transition"
        >
          <span className="flex flex-col items-center gap-2 px-4 text-center">
            <ArrowRight className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.14em]">
              View all
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}

function labelForKind(k?: string) {
  switch (k) {
    case "course":
      return "Course";
    case "ebook":
      return "E-book";
    case "service":
      return "Service";
    case "bundle":
      return "Bundle";
    default:
      return "Product";
  }
}

export default ProductShowcase;
