import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { FeedStoriesRail } from "../feed/FeedStoriesRail";
import { FeedItemRenderer } from "../feed/FeedItemRenderer";
import type { FeedItem } from "../feed/feed-types";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { supabase } from "@/integrations/supabase/client";
import { adaptPost, hydrateWithProfiles, type PostRow } from "@/lib/community-adapters";
import {
  CommunityEmpty,
  CommunityError,
  FeedCardSkeleton,
  SkeletonList,
} from "@/components/community/CommunityState";


export function MyFeedTab() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["community-feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, images, video_url, rating, type, user_id, created_at, product_id")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return hydrateWithProfiles((data ?? []) as PostRow[]);
    },
  });

  const items: FeedItem[] = (data ?? []).map((row) => ({
    id: `post-${row.id}`,
    type: "post" as const,
    data: adaptPost(row),
  }));

  const { displayedItems, isLoading: scrollLoading, loaderRef } = useInfiniteScroll<FeedItem>({
    items,
    itemsPerPage: 4,
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      <FeedStoriesRail />

      {isLoading ? (
        <SkeletonList count={3}>
          <FeedCardSkeleton />
        </SkeletonList>
      ) : isError ? (
        <CommunityError message="Could not load feed." onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <CommunityEmpty
          icon={Sparkles}
          title="Your feed is empty"
          description="Be the first to share something with the community."
          action={{ label: "Create a post", onClick: () => navigate("/community/create") }}
        />
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {displayedItems.map((item, index) => (
            <FeedItemRenderer
              key={item._loopKey ?? `${item.id}-${index}`}
              item={item}
              index={index}
            />
          ))}
          <div ref={loaderRef} className="flex justify-center py-4">
            {scrollLoading && (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
