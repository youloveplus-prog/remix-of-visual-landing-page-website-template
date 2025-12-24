import { ShortCard } from "@/components/community/ShortCard";
import { mockShorts } from "@/lib/community-mock-data";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Loader2 } from "lucide-react";

export function ShortsTab() {
  const { displayedItems, isLoading, loaderRef } = useInfiniteScroll({
    items: mockShorts,
    itemsPerPage: 4,
  });

  return (
    <div className="px-4 pb-4">
      <div className="grid grid-cols-2 gap-3">
        {displayedItems.map((short) => (
          <ShortCard key={short._loopKey} short={short} />
        ))}
      </div>
      
      <div ref={loaderRef} className="flex justify-center py-4">
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
