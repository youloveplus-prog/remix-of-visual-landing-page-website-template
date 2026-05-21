import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <AppLayout showBottomNav>
      <div className="space-y-0">
        <Skeleton className="w-full h-32 rounded-none" />
        <Skeleton className="h-20 w-20 -mt-10 ml-4 rounded-full border-4 border-background" />
        <Skeleton className="w-40 h-5 mt-3 ml-4" />
        <Skeleton className="w-24 h-3 mt-1 ml-4" />

        <div className="grid grid-cols-5 gap-2 py-4 mt-4 border-t border-b border-border/60 px-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <Skeleton className="w-8 h-5" />
              <Skeleton className="w-12 h-2" />
            </div>
          ))}
        </div>

        <div className="flex gap-2 px-4 mt-4">
          <Skeleton className="flex-1 h-9 rounded-lg" />
          <Skeleton className="flex-1 h-9 rounded-lg" />
        </div>

        <div className="flex gap-2 px-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>

        <div className="space-y-3 px-4 mt-4 pb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
