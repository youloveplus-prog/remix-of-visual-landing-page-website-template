import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondary?: ReactNode;
  className?: string;
  /** Optional illustration shown above the icon */
  illustration?: ReactNode;
}

/**
 * Friendly empty state — branded illustration slot, icon, title,
 * supporting copy and a primary action. Use anywhere a list or
 * feed has no items yet (cart, wishlist, orders, search, feed).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondary,
  className,
  illustration,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass-subtle rounded-3xl text-center px-6 py-10 sm:py-14 flex flex-col items-center gap-4 animate-fade-in",
        className,
      )}
    >
      {illustration}
      {Icon && (
        <div
          className="size-14 rounded-2xl grid place-items-center"
          style={{ background: "var(--gradient-primary-soft)" }}
          aria-hidden
        >
          <Icon className="size-6 text-primary" />
        </div>
      )}
      <div className="max-w-sm space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {(actionLabel || secondary) && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {actionLabel && actionHref && (
            <Button asChild className="rounded-full">
              <Link to={actionHref}>{actionLabel}</Link>
            </Button>
          )}
          {actionLabel && !actionHref && onAction && (
            <Button onClick={onAction} className="rounded-full">
              {actionLabel}
            </Button>
          )}
          {secondary}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
