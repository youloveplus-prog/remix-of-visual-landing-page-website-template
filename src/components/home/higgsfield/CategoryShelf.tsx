import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";

export function CategoryShelf() {
  const { data: categories } = useCategories();
  const items = categories ?? [];
  if (!items.length) return null;
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Shop by category
        </h2>
        <Link
          to="/shop"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-[hsl(var(--hf-accent))]"
        >
          All →
        </Link>
      </div>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
        {items.map((c: any) => (
          <Link
            key={c.id}
            to={`/shop?category=${c.slug}`}
            className="group flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-neutral-950 px-4 py-2 text-[13px] font-medium text-white hover:border-[hsl(var(--hf-accent))]/60 hover:text-[hsl(var(--hf-accent))]"
          >
            <span className="text-base leading-none">{c.icon ?? "✦"}</span>
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
