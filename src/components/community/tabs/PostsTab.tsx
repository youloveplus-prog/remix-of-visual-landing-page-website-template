import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { PostCard } from "@/components/community/PostCard";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { supabase } from "@/integrations/supabase/client";
import { adaptPost, hydrateWithProfiles, type PostRow } from "@/lib/community-adapters";
import {
  CommunityEmpty,
  CommunityError,
  FeedCardSkeleton,
  SkeletonList,
} from "@/components/community/CommunityState";

export function PostsTab() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, images, video_url, rating, type, user_id, created_at, product_id")
        .eq("type", "post")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return hydrateWithProfiles((data ?? []) as PostRow[]);
    },
  });

  const posts = (data ?? []).map(adaptPost);
  const { displayedItems, isLoading: scrollLoading, loaderRef } = useInfiniteScroll({
    items: posts,
    itemsPerPage: 3,
  });

  if (isLoading) {
    return (
      <SkeletonList count={3}>
        <FeedCardSkeleton />
      </SkeletonList>
    );
  }

  if (isError) {
    return <CommunityError message="Could not load posts." onRetry={() => refetch()} />;
  }

  if (posts.length === 0) {
    return (
      <CommunityEmpty
        icon={MessageSquarePlus}
        title="No posts yet — be the first!"
        description="Share what you're learning with the community."
        action={{ label: "Create a post", onClick: () => navigate("/community/create") }}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      {displayedItems.map((post) => (
        <PostCard key={post._loopKey} post={post} />
      ))}
      <div ref={loaderRef} className="flex justify-center py-4">
        {scrollLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />}
      </div>
    </div>
  );
}
