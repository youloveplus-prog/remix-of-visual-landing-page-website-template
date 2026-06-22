import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <AppLayout showBottomNav>
      <div className="space-y-0">
        {/* Cover */}
        <Skeleton className="w-full h-32 sm:h-44 rounded-none" />

        {/* Avatar + identity (centered) */}
        <div className="flex flex-col items-center px-4 -mt-12 sm:-mt-16">
          <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-background" />
          <Skeleton className="w-40 h-5 mt-3" />
          <Skeleton className="w-24 h-3 mt-2" />
          <Skeleton className="w-28 h-5 mt-2 rounded-full" />
          <Skeleton className="w-64 h-3 mt-3" />
        </div>

        {/* 3-cell stats */}
        <div className="px-4 pt-4">
          <div className="grid grid-cols-3 rounded-2xl border border-border/60 overflow-hidden">
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
        <div className="flex gap-2 px-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
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
