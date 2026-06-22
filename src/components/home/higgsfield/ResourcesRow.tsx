import { Link } from "react-router-dom";
import { RESOURCES } from "@/data/resources";

export function ResourcesRow() {
  const featured = RESOURCES.find((r) => r.trending) ?? RESOURCES[0];
  const rest = RESOURCES.filter((r) => r.slug !== featured.slug).slice(0, 3);

  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="hf-title font-display">
          Free resources
        </h2>
        <Link
          to="/resources"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-[hsl(var(--hf-accent))]"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
        <Link
          to={`/resources/${featured.slug}`}
          className="group relative col-span-1 block aspect-[4/5] overflow-hidden rounded-[10px] border border-white/10 bg-neutral-900 lg:col-span-2 lg:aspect-auto"
        >
          <img
            src={featured.cover}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <span className="self-start rounded-sm bg-[hsl(var(--hf-accent))] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
              Featured
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-white sm:text-3xl">
              {featured.title}
            </h3>
            <p className="mt-1 line-clamp-2 max-w-md text-[13px] text-white/60">
              {featured.excerpt}
            </p>
          </div>
        </Link>
        {rest.map((r) => (
          <Link
            key={r.slug}
            to={`/resources/${r.slug}`}
            className="group block rounded-[10px] border border-white/10 bg-neutral-950 p-3 hover:border-[hsl(var(--hf-accent))]/50"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] bg-neutral-900">
              <img
                src={r.cover}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
            <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/40">
              {r.category}
            </div>
            <div className="mt-1 line-clamp-2 text-[14px] font-semibold text-white group-hover:text-[hsl(var(--hf-accent))]">
              {r.title}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
