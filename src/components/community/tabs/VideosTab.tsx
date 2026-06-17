import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  CommunityEmpty,
  CommunityError,
  SkeletonGrid,
  VideoCardSkeleton,
} from "@/components/community/CommunityState";

export function VideosTab() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["community-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, video_url, created_at, user_id")
        .eq("type", "video")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <SkeletonGrid count={4} cols="sm:grid-cols-2">
        <VideoCardSkeleton />
      </SkeletonGrid>
    );
  }

  if (isError) {
    return <CommunityError message="Could not load videos." onRetry={() => refetch()} />;
  }

  if (!data || data.length === 0) {
    return (
      <CommunityEmpty
        icon={GraduationCap}
        title="Videos coming soon"
        description="Check back later for community videos and lessons."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
      {data.map((v: any) => (
        <article key={v.id} className="rounded-2xl overflow-hidden border border-border bg-card">
          {v.video_url && (
            <video src={v.video_url} controls className="w-full aspect-video bg-black" />
          )}
          {v.content && (
            <div className="p-4">
              <p className="text-sm line-clamp-2">{v.content}</p>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
