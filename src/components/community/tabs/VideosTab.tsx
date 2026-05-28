import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export function VideosTab() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["community-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `id, content, video_url, created_at, user_id,
           profiles:profiles!posts_user_id_fkey (id, username, full_name, avatar_url)`
        )
        .eq("type", "video")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="px-4 space-y-4 pb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-12 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Could not load videos. Try again.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="px-4 py-16 text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-base">Videos coming soon</h3>
        <p className="text-sm text-muted-foreground">Check back later for community videos.</p>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-4 pb-4">
      {data.map((v: any) => (
        <article key={v.id} className="bg-card rounded-2xl overflow-hidden border border-border">
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
