import { ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Shared loading / empty / error states for every Community tab.
 * Keeps spacing, max-width, and alignment identical regardless of which
 * tab the user lands on or whether content is missing.
 *
 * All states assume the parent (MobilePage > main) already applies the
 * page gutter — these blocks never add their own `px-*`.
 */

const FRAME = "mx-auto w-full max-w-[640px]";

/* -------------------------------- Empty -------------------------------- */

interface CommunityEmptyProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function CommunityEmpty({
  icon: Icon,
  title,
  description,
  action,
}: CommunityEmptyProps) {
  return (
    <div
      className={cn(
        FRAME,
        "flex flex-col items-center justify-center text-center",
        "px-6 py-12 sm:py-16",
        "rounded-2xl border border-dashed border-border bg-card/40",
        "space-y-3 sm:space-y-4",
      )}
      role="status"
      aria-live="polite"
    >
      <div className="grid place-items-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-secondary">
        <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-muted-foreground" aria-hidden />
      </div>
      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-display font-semibold text-base sm:text-lg leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Button onClick={action.onClick} size="sm" className="mt-1">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/* -------------------------------- Error -------------------------------- */

interface CommunityErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function CommunityError({
  message = "Something went wrong loading this section.",
  onRetry,
}: CommunityErrorProps) {
  return (
    <div
      className={cn(
        FRAME,
        "flex flex-col items-center justify-center text-center",
        "px-6 py-12 sm:py-14",
        "rounded-2xl border border-border bg-card",
        "space-y-3",
      )}
      role="alert"
    >
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

/* ------------------------------ Skeletons ------------------------------ */

/** Feed-style card skeleton (My Feed, Posts). */
export function FeedCardSkeleton() {
  return (
    <div
      className={cn(
        FRAME,
        "-mx-4 sm:mx-auto",
        "bg-card border-y border-border sm:border sm:rounded-2xl overflow-hidden",
        "p-4 space-y-3",
      )}
      aria-hidden
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-3.5 w-5/6" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="aspect-[4/3] sm:aspect-[16/11] w-full rounded-xl" />
      <div className="flex items-center gap-4 pt-1">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}

/** Review-style card skeleton. */
export function ReviewCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3" aria-hidden>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-1/4" />
        </div>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-3.5 rounded-sm" />
        ))}
      </div>
      <Skeleton className="h-3.5 w-5/6" />
      <Skeleton className="h-3.5 w-2/3" />
    </div>
  );
}

/** Video card skeleton (16:9 media + 2-line caption). */
export function VideoCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden" aria-hidden>
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

/** Short / vertical media tile skeleton (9:16). */
export function ShortTileSkeleton() {
  return <Skeleton className="aspect-[9/16] w-full rounded-2xl" aria-hidden />;
}

/** Offer card skeleton (16:9 media + meta). */
export function OfferCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden" aria-hidden>
      <Skeleton className="aspect-[16/9] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-8 w-full mt-2 rounded-md" />
      </div>
    </div>
  );
}

/* ------------------------------ Wrappers ------------------------------ */

/** Stacked list of skeletons with consistent vertical rhythm. */
export function SkeletonList({
  count = 3,
  children,
  className,
}: {
  count?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4 sm:space-y-5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{children}</div>
      ))}
    </div>
  );
}

/** Responsive grid wrapper for skeletons (videos, offers). */
export function SkeletonGrid({
  count = 4,
  children,
  cols = "sm:grid-cols-2",
  className,
}: {
  count?: number;
  children: ReactNode;
  cols?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4", cols, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{children}</div>
      ))}
    </div>
  );
}
