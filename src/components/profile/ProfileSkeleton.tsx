import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <AppLayout showBottomNav>
      <div className="space-y-0 animate-fade-in" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading profile…</span>

        {/* Cover */}
        <div className="relative">
          <Skeleton className="w-full h-32 sm:h-44 rounded-none" />
          {/* Top-right action cluster placeholder */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full hidden sm:block" />
            <Skeleton className="h-9 w-9 rounded-full sm:hidden" />
          </div>
        </div>

        {/* Avatar + identity (centered) — mirrors ProfileHeader */}
        <div className="flex flex-col items-center px-4 -mt-12 sm:-mt-16">
          <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-background ring-2 ring-border shadow-xl" />

          {/* Eyebrow */}
          <Skeleton className="mt-4 h-2.5 w-20 rounded-full" />
          {/* Title (name) */}
          <Skeleton className="mt-2 h-6 w-44" />
          {/* @username */}
          <Skeleton className="mt-2 h-3 w-24" />
          {/* Trust chip */}
          <Skeleton className="mt-3 h-6 w-28 rounded-full" />
          {/* Bio (2 lines) */}
          <div className="mt-3 w-full max-w-md flex flex-col items-center gap-1.5">
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-9/12" />
          </div>
          {/* Meta row */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        {/* 3-cell stats */}
        <div className="px-4 pt-4">
          <div className="grid grid-cols-3 rounded-2xl border border-border/60 overflow-hidden hf-card-depth-subtle">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center py-3 gap-1.5">
                <Skeleton className="w-10 h-5" />
                <Skeleton className="w-14 h-2.5" />
              </div>
            ))}
          </div>
          {/* XP bar */}
          <Skeleton className="mt-3 h-14 w-full rounded-2xl" />
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 pt-3">
          <Skeleton className="flex-1 h-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 mt-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full shrink-0" />
          ))}
        </div>

        {/* Content placeholders */}
        <div className="space-y-3 px-4 mt-4 pb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

