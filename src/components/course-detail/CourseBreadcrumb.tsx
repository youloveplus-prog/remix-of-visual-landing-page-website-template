import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Crumb { label: string; to?: string }

export function CourseBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        return (
          <div key={i} className="flex items-center gap-2 min-w-0">
            {c.to && !isLast ? (
              <Link to={c.to} className="text-muted-foreground hover:text-foreground transition-colors truncate">
                {c.label}
              </Link>
            ) : (
              <span className={isLast ? "text-foreground font-medium truncate" : "text-muted-foreground truncate"}>
                {c.label}
              </span>
            )}
            {!isLast && <ChevronRight className="w-4 h-4 text-muted-foreground/60 shrink-0" />}
          </div>
        );
      })}
    </nav>
  );
}
