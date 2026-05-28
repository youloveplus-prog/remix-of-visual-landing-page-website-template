import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export function ShortsTab() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["community-shorts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `id, content, video_url, created_at, user_id,
           profiles:profiles!posts_user_id_fkey (id, username, full_name, avatar_url)`
        )
        .eq("type", "short")
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="px-4 pb-4 grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-[9/16] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-12 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Could not load shorts. Try again.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="px-4 py-16 text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-display font-semibold text-base">Shorts coming soon</h3>
        <p className="text-sm text-muted-foreground">Check back later for bite-sized clips.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 grid grid-cols-2 gap-3">
      {data.map((s: any) => (
        <article key={s.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-card border border-border">
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
