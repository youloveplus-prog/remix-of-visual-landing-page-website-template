import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { FeedStoriesRail } from "../feed/FeedStoriesRail";
import { FeedItemRenderer } from "../feed/FeedItemRenderer";
import type { FeedItem } from "../feed/feed-types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { supabase } from "@/integrations/supabase/client";
import { adaptPost, type PostRow } from "@/lib/community-adapters";

function FeedSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[640px] bg-card border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="aspect-video w-full rounded-xl" />
    </div>
  );
}

export function MyFeedTab() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["community-feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `id, content, images, video_url, rating, type, user_id, created_at, product_id,
           profiles:profiles!posts_user_id_fkey (id, username, full_name, avatar_url, is_verified, trust_score)`
        )
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return (data ?? []) as unknown as PostRow[];
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
    <div className="space-y-5">
      <FeedStoriesRail />

      {isLoading ? (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => <FeedSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="mx-auto max-w-[640px] py-12 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Could not load feed. Try again.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : items.length === 0 ? (
        <div className="mx-auto max-w-[640px] py-16 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base">Your feed is empty</h3>
            <p className="text-sm text-muted-foreground mt-1">Be the first to share something with the community.</p>
          </div>
          <Button onClick={() => navigate("/community/create")}>Create a post</Button>
        </div>
      ) : (
        <div className="space-y-5">
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
