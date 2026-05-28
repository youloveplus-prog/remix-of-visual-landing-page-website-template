import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { PostCard } from "@/components/community/PostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { supabase } from "@/integrations/supabase/client";
import { adaptPost, type PostRow } from "@/lib/community-adapters";

function PostSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[640px] bg-card border-y border-border sm:border sm:rounded-2xl overflow-hidden p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="aspect-[16/11] w-full rounded-xl" />
    </div>
  );
}

export function PostsTab() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["community-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `id, content, images, video_url, rating, type, user_id, created_at, product_id,
           profiles:profiles!posts_user_id_fkey (id, username, full_name, avatar_url, is_verified, trust_score)`
        )
        .eq("type", "post")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as unknown as PostRow[];
    },
  });

  const posts = (data ?? []).map(adaptPost);
  const { displayedItems, isLoading: scrollLoading, loaderRef } = useInfiniteScroll({
    items: posts,
    itemsPerPage: 3,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <PostSkeleton key={i} />)}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-[640px] py-12 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Could not load posts. Try again.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-[640px] py-16 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
          <MessageSquarePlus className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-base">No posts yet — be the first!</h3>
          <p className="text-sm text-muted-foreground mt-1">Share what you're learning with the community.</p>
        </div>
        <Button onClick={() => navigate("/community/create")}>Create a post</Button>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {displayedItems.map((post) => (
        <PostCard key={post._loopKey} post={post} />
      ))}
      <div ref={loaderRef} className="flex justify-center py-4">
        {scrollLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
      </div>
    </div>
  );
}
