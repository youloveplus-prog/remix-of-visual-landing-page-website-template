import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  /** Optional eyebrow rendered above the breadcrumb trail. */
  eyebrow?: string;
  className?: string;
}

/**
 * Shared breadcrumb component. Emits JSON-LD for SEO and uses the
 * `hf-eyebrow` token so styling stays consistent across pages.
 */
export function Breadcrumbs({ items, eyebrow, className }: BreadcrumbsProps) {
  if (!items.length) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.to ? { item: typeof window !== "undefined" ? `${window.location.origin}${c.to}` : c.to } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      {eyebrow && <p className="hf-eyebrow mb-1">{eyebrow}</p>}
      <ol className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1 min-w-0">
              {c.to && !isLast ? (
                <Link
                  to={c.to}
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  {c.label}
                </Link>
              ) : (
                <span className={isLast ? "text-foreground font-medium truncate max-w-[40vw]" : ""} aria-current={isLast ? "page" : undefined}>
                  {c.label}
                </span>
              )}
              {!isLast && <ChevronRight className="w-3 h-3 opacity-60 shrink-0" aria-hidden />}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
