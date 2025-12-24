import { PostCard } from "@/components/community/PostCard";
import { mockPosts } from "@/lib/mock-data";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { Loader2 } from "lucide-react";

export function PostsTab() {
  const { displayedItems, isLoading, loaderRef } = useInfiniteScroll({
    items: mockPosts,
    itemsPerPage: 3,
  });

  return (
    <div className="space-y-0">
      {displayedItems.map((post) => (
        <PostCard key={post._loopKey} post={post} />
      ))}
      
      <div ref={loaderRef} className="flex justify-center py-4">
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}
