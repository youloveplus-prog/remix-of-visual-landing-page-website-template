import { ResourceCard } from "./ResourceCard";
import type { Resource } from "@/data/resources";

interface ResourceGridProps {
  resources: Resource[];
  title?: string;
  avatarSrc?: string;
  emptyAction?: React.ReactNode;
}

export function ResourceGrid({ resources, title, avatarSrc, emptyAction }: ResourceGridProps) {
  return (
    <section aria-label={title ?? "Resources"}>
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {avatarSrc && (
            <img
              src={avatarSrc}
              alt=""
              className="w-9 h-9 rounded-full object-cover border border-border/70"
            />
          )}
          <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
        </div>
      )}

      {resources.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/70 bg-card p-10 text-center">
          <p className="font-display text-xl text-foreground">No matches.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different keyword or clear your filters.
          </p>
          {emptyAction && <div className="mt-4">{emptyAction}</div>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {resources.map((r) => (
            <ResourceCard key={r.slug} resource={r} />
          ))}
        </div>
      )}
    </section>
  );
}
