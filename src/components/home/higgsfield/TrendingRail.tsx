import { Link } from "react-router-dom";

export type TrendingItem = {
  id: string;
  title: string;
  image: string;
  meta?: string;
  to: string;
};

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
    <section className="hf-section">
      <div className="mb-3 flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-white">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-[hsl(var(--hf-accent))]"
          >
            View all →
          </Link>
        )}
      </div>
      <div className="scrollbar-hide overflow-x-auto">
        <div className="flex gap-3 px-4 pb-2 sm:px-6 lg:px-8">
          {items.map((it) => (
            <Link
              key={it.id}
              to={it.to}
              className="group relative block w-[220px] shrink-0 sm:w-[260px]"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] border border-white/10 bg-neutral-900">
                <img
                  src={it.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <div className="mt-2">
                <div className="line-clamp-2 text-[14px] font-semibold text-white group-hover:text-[hsl(var(--hf-accent))]">
                  {it.title}
                </div>
                {it.meta && (
                  <div className="mt-0.5 text-[11px] uppercase tracking-[0.14em] text-white/40">
                    {it.meta}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
