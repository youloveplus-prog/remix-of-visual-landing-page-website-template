import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export interface CrossLink {
  label: string;
  to: string;
  icon?: LucideIcon;
}

interface CrossLinkChipsProps {
  eyebrow?: string;
  links: CrossLink[];
  className?: string;
}

/**
 * Inline chip row of cross-page CTAs (e.g. "Ask AI Tutor", "Discuss", "Find mentor").
 */
export function CrossLinkChips({ eyebrow = "Keep going", links, className }: CrossLinkChipsProps) {
  if (!links.length) return null;
  return (
    <div className={className}>
      {eyebrow && <p className="hf-eyebrow mb-2">{eyebrow}</p>}
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <li key={l.to + l.label}>
              <Link
                to={l.to}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium hover:bg-card hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {Icon && <Icon className="w-3.5 h-3.5" aria-hidden />}
                <span>{l.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
