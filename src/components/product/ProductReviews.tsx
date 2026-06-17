import { useMemo, useState } from "react";
import { Star, ThumbsUp, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

interface ProductReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { stars: number; count: number }[];
}

type RatingFilter = "all" | 5 | 4 | 3 | 2 | 1;

export function ProductReviews({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}: ProductReviewsProps) {
  const maxCount = Math.max(...ratingDistribution.map((r) => r.count), 1);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [withPhotos, setWithPhotos] = useState(false);

  const verifiedCount = useMemo(
    () => reviews.filter((r) => r.isVerifiedPurchase).length,
    [reviews],
  );

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (ratingFilter !== "all" && r.rating !== ratingFilter) return false;
      if (verifiedOnly && !r.isVerifiedPurchase) return false;
      if (withPhotos && (!r.images || r.images.length === 0)) return false;
      return true;
    });
  }, [reviews, ratingFilter, verifiedOnly, withPhotos]);

  const chip = (active: boolean) =>
    cn(
      "h-8 rounded-full px-3 text-[12.5px] font-medium border transition-colors whitespace-nowrap",
      active
        ? "bg-foreground text-background border-foreground"
        : "bg-background text-foreground/80 border-border hover:border-foreground/40",
    );

  return (
    <section className="space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 p-5 rounded-2xl bg-secondary/30 border border-border/50">
        <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-1">
          <span className="font-display text-5xl font-bold tabular-nums leading-none">
            {averageRating.toFixed(1)}
          </span>
          <div>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/40",
                  )}
                />
              ))}
            </div>
            <p className="text-[12px] text-muted-foreground mt-1">
              Based on {totalReviews.toLocaleString()} reviews
              {verifiedCount > 0 && (
                <> · {verifiedCount} verified</>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          {ratingDistribution.map((item) => {
            const pct = (item.count / maxCount) * 100;
            const active = ratingFilter === item.stars;
            return (
              <button
                key={item.stars}
                type="button"
                onClick={() =>
                  setRatingFilter(active ? "all" : (item.stars as RatingFilter))
                }
                className={cn(
                  "w-full flex items-center gap-2 rounded-lg px-1.5 py-0.5 transition-colors text-left",
                  active ? "bg-foreground/5" : "hover:bg-foreground/[0.03]",
                )}
                aria-pressed={active}
                aria-label={`Filter by ${item.stars} stars`}
              >
                <span className="text-xs w-3 tabular-nums">{item.stars}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <Progress value={pct} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        <button
          type="button"
          onClick={() => {
            setRatingFilter("all");
            setVerifiedOnly(false);
            setWithPhotos(false);
          }}
          className={chip(ratingFilter === "all" && !verifiedOnly && !withPhotos)}
        >
          All reviews
        </button>
        <button
          type="button"
          onClick={() => setVerifiedOnly((v) => !v)}
          className={chip(verifiedOnly)}
          aria-pressed={verifiedOnly}
        >
          <CheckCircle2 className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
          Verified buyers
        </button>
        <button
          type="button"
          onClick={() => setWithPhotos((v) => !v)}
          className={chip(withPhotos)}
          aria-pressed={withPhotos}
        >
          <ImageIcon className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
          With photos
        </button>
        {ratingFilter !== "all" && (
          <button
            type="button"
            onClick={() => setRatingFilter("all")}
            className={chip(true)}
          >
            {ratingFilter}★ only ×
          </button>
        )}
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-[13px] text-muted-foreground py-6 text-center">
            No reviews match these filters yet.
          </p>
        ) : (
          filtered.map((review) => (
            <article
              key={review.id}
              className="p-4 rounded-2xl bg-card border border-border/50"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.userAvatar} />
                  <AvatarFallback>{review.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{review.userName}</span>
                    {review.isVerifiedPurchase && (
                      <Badge variant="secondary" className="gap-1 text-[10px]">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3 w-3",
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/40",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {review.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="font-semibold">{review.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {review.content}
                </p>
              </div>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
                <Button variant="ghost" size="sm" className="gap-2 text-xs">
                  <ThumbsUp className="h-3 w-3" />
                  Helpful ({review.helpfulCount})
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
