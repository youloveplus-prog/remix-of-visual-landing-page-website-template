import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  CommunityEmpty,
  CommunityError,
  ShortTileSkeleton,
  SkeletonGrid,
} from "@/components/community/CommunityState";

export function ShortsTab() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["community-shorts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, video_url, created_at, user_id")
        .eq("type", "short")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <SkeletonGrid count={6} cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <ShortTileSkeleton />
      </SkeletonGrid>
    );
  }

  if (isError) {
    return <CommunityError message="Could not load shorts." onRetry={() => refetch()} />;
  }

  if (!data || data.length === 0) {
    return (
      <CommunityEmpty
        icon={Sparkles}
        title="Shorts coming soon"
        description="Bite-sized clips from the community will appear here."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
      {data.map((s: any) => (
        <article
          key={s.id}
          className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-card border border-border"
        >
          {s.video_url ? (
            <video src={s.video_url} className="w-full h-full object-cover" muted playsInline />
          ) : (
            <div className="w-full h-full grid place-items-center text-xs text-muted-foreground p-3 text-center">
              {s.content}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
