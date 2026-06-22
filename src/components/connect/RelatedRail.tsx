import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export type RailItemKind = "course" | "resource" | "mentor" | "post" | "topic" | "product" | "lesson";

export interface RailItem {
  id: string;
  kind: RailItemKind;
  title: string;
  subtitle?: string;
  to: string;
  image?: string;
  meta?: string;
}

interface RelatedRailProps {
  title: string;
  eyebrow?: string;
  items: RailItem[];
  isLoading?: boolean;
  emptyHint?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

const KIND_LABEL: Record<RailItemKind, string> = {
  course: "Course",
  resource: "Resource",
  mentor: "Mentor",
  post: "Discussion",
  topic: "Topic",
  product: "Item",
  lesson: "Lesson",
};

/**
 * Heterogeneous "Continue your journey" rail used at the bottom of every detail page.
 */
export function RelatedRail({
  title,
  eyebrow,
  items,
  isLoading,
  emptyHint,
  viewAllHref,
  viewAllLabel = "View all",
}: RelatedRailProps) {
  if (!isLoading && items.length === 0 && !emptyHint) return null;

  return (
    <section aria-labelledby="related-rail-heading" className="hf-section">
      <header className="flex items-end justify-between gap-3 mb-3">
        <div className="min-w-0">
          {eyebrow && <p className="hf-eyebrow">{eyebrow}</p>}
          <h2 id="related-rail-heading" className="hf-title font-display truncate">
            {title}
          </h2>
        </div>
        {viewAllHref && (
          <Link
            to={viewAllHref}
            className="hf-eyebrow inline-flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
          >
            {viewAllLabel}
            <ArrowRight className="w-3 h-3" aria-hidden />
          </Link>
        )}
      </header>

      <div
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide"
        role="list"
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="snap-start shrink-0 w-[68%] sm:w-64" role="listitem">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="mt-2 h-3 w-16" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </div>
            ))
          : items.length === 0
            ? <p className="text-sm text-muted-foreground py-6">{emptyHint}</p>
            : items.map((it) => (
                <Link
                  key={`${it.kind}-${it.id}`}
                  to={it.to}
                  role="listitem"
                  className="snap-start shrink-0 w-[68%] sm:w-64 group hf-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
                >
                  <div className="hf-card-depth-subtle rounded-2xl overflow-hidden">
                    <div className="aspect-[16/10] bg-muted/40 overflow-hidden">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt=""
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="hf-eyebrow">{KIND_LABEL[it.kind]}</p>
                      <h3 className="mt-1 text-sm font-medium leading-snug line-clamp-2">{it.title}</h3>
                      {(it.subtitle || it.meta) && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                          {it.subtitle ?? it.meta}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
      </div>
    </section>
  );
}
