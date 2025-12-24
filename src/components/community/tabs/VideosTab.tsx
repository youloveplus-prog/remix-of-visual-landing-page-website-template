import { VideoCard } from "@/components/community/VideoCard";
import { mockVideos } from "@/lib/community-mock-data";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Loader2 } from "lucide-react";

export function VideosTab() {
  const { displayedItems, isLoading, loaderRef } = useInfiniteScroll({
    items: mockVideos,
    itemsPerPage: 3,
  });

  return (
    <div className="px-4 space-y-4 pb-4">
      {displayedItems.map((video) => (
        <VideoCard key={video._loopKey} video={video} />
      ))}
      
      <div ref={loaderRef} className="flex justify-center py-4">
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
