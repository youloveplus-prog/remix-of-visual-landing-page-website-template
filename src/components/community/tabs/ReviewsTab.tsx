import { Star, Quote } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { adaptPost, hydrateWithProfiles, type PostRow, formatTime } from "@/lib/community-adapters";
import { cn } from "@/lib/utils";
import {
  CommunityEmpty,
  CommunityError,
  ReviewCardSkeleton,
  SkeletonList,
} from "@/components/community/CommunityState";

const filters = [
  { label: "All", value: 0 },
  { label: "5★", value: 5 },
  { label: "4★", value: 4 },
  { label: "3★", value: 3 },
  { label: "2★", value: 2 },
  { label: "1★", value: 1 },
];

export function ReviewsTab() {
  const [activeFilter, setActiveFilter] = useState(0);
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["community-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, images, rating, type, user_id, created_at, product_id")
        .eq("type", "review")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return hydrateWithProfiles((data ?? []) as PostRow[]);
    },
  });

  const reviews = useMemo(() => (data ?? []).map((row) => ({
    raw: row,
    post: adaptPost(row),
  })), [data]);

  const filtered = useMemo(() => {
    return activeFilter === 0
      ? reviews
      : reviews.filter((r) => r.raw.rating === activeFilter);
  }, [reviews, activeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              activeFilter === filter.value
                ? "gradient-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.value > 0 && <Star className="h-3 w-3 fill-current" />}
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="liquid-glass border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-sm text-muted-foreground">Could not load reviews. Try again.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
            <Star className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-display font-semibold text-base">No reviews yet</h3>
          <p className="text-sm text-muted-foreground">Be the first to share your experience.</p>
          <Button onClick={() => navigate("/community/create")}>Write a review</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ raw, post }) => (
            <article key={raw.id} className="liquid-glass border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={post.user.avatar} alt={post.user.name} />
                  <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{post.user.name}</p>
                  <p className="text-[11.5px] text-muted-foreground">{formatTime(raw.created_at)}</p>
                </div>
              </div>

              {raw.rating != null ? (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < (raw.rating ?? 0) ? "fill-gold text-gold" : "fill-muted text-muted"
                      )}
                    />
                  ))}
                </div>
              ) : (
                <Quote className="h-4 w-4 text-muted-foreground" />
              )}

              {raw.content && (
                <p className="text-[13.5px] text-foreground/80 leading-relaxed">{raw.content}</p>
              )}

              {raw.images && raw.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {raw.images.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt={`Review image ${i + 1}`}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
