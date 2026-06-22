import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { Resource } from "@/data/resources";

interface ResourceCardProps {
  resource: Resource;
  className?: string;
}

export function ResourceCard({ resource, className }: ResourceCardProps) {
  return (
    <Link
      to={`/resources/${resource.slug}`}
      className={cn(
        "group block rounded-3xl overflow-hidden bg-card border border-border/60 shadow-sm",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={resource.cover}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {/* Bottom gradient for legibility */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.78) 100%)",
          }}
        />
        {resource.trending && (
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground shadow-sm">
            Trending
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <p className="font-dot text-[10px] uppercase tracking-[0.22em] text-white/75">
            {resource.category}
          </p>
          <h3 className="mt-1 font-display font-semibold text-[17px] sm:text-[19px] leading-tight text-white drop-shadow">
            {resource.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
