import { memo } from "react";
import { Star, ThumbsUp, Play } from "lucide-react";
import { Review } from "@/types/community";
import { CreatorCard } from "./CreatorCard";
import { VerifiedBuyerBadge } from "./VerifiedBuyerBadge";
import { ProductTag } from "./ProductTag";

interface ReviewCardProps {
  review: Review;
}

function ReviewCardImpl({ review }: ReviewCardProps) {
  return (
    <article className="bg-card border border-border rounded-2xl p-4 space-y-3.5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <CreatorCard user={review.user} timestamp={review.timestamp} />
        {review.isVerifiedPurchase && <VerifiedBuyerBadge />}
      </div>

      {/* Rating + title */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < review.rating
                  ? "fill-gold text-gold"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
        </div>
        {review.title && (
          <h4 className="font-semibold text-[14px] leading-snug">{review.title}</h4>
        )}
      </div>

      {/* Content */}
      <p className="text-[13.5px] text-foreground/80 leading-relaxed">{review.content}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Review image ${index + 1}`}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
            />
          ))}
          {review.videoUrl && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
              <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
                <Play className="h-6 w-6 fill-foreground" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Product */}
      <ProductTag product={review.product} variant="inline" />

      {/* Helpful */}
      <div className="border-t border-border pt-3">
        <button className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>Helpful (<span className="tabular-nums">{review.helpfulCount}</span>)</span>
        </button>
      </div>
    </article>
  );
}

export const ReviewCard = memo(ReviewCardImpl);
