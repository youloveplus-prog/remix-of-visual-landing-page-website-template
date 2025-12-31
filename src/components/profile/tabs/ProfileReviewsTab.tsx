import { Star, ThumbsUp, ShoppingBag, CheckCircle, Image as ImageIcon, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  video?: string;
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

interface ProfileReviewsTabProps {
  reviews: Review[];
}

export function ProfileReviewsTab({ reviews }: ProfileReviewsTabProps) {
  // Calculate stats
  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";
  const verifiedCount = reviews.filter(r => r.isVerifiedPurchase).length;
  const withPhotos = reviews.filter(r => r.images && r.images.length > 0).length;

  return (
    <div>
      {/* Stats Banner */}
      {reviews.length > 0 && (
        <div className="p-4 glass border-b border-border">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-xl font-bold">{totalReviews}</p>
              <p className="text-[10px] text-muted-foreground">Reviews</p>
            </div>
            <div>
              <p className="text-xl font-bold text-amber-400">{avgRating}</p>
              <p className="text-[10px] text-muted-foreground">Avg Rating</p>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">{verifiedCount}</p>
              <p className="text-[10px] text-muted-foreground">Verified</p>
            </div>
            <div>
              <p className="text-xl font-bold text-blue-400">{withPhotos}</p>
              <p className="text-[10px] text-muted-foreground">With Photos</p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="divide-y divide-border">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="py-16 text-center">
          <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No reviews yet</p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="p-4">
      {/* Product Reference */}
      <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-secondary/30">
        <img 
          src={review.productImage} 
          alt={review.productName}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-1">{review.productName}</p>
          <div className="flex items-center gap-2">
            {review.isVerifiedPurchase && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                <CheckCircle className="h-3 w-3" />
                Verified Purchase
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 px-2 py-1 rounded-full bg-amber-500/20">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-amber-400">{review.rating}</span>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={cn(
              "h-4 w-4",
              star <= review.rating 
                ? "fill-amber-400 text-amber-400" 
                : "text-muted-foreground/30"
            )}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-2">{review.createdAt}</span>
      </div>

      {/* Title & Content */}
      {review.title && (
        <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
      )}
      <p className="text-sm text-foreground/90 mb-3">{review.content}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar">
          {review.images.map((img, idx) => (
            <div key={idx} className="relative flex-shrink-0">
              <img 
                src={img} 
                alt={`Review image ${idx + 1}`}
                className="h-20 w-20 rounded-lg object-cover"
              />
            </div>
          ))}
          {review.video && (
            <div className="relative flex-shrink-0 h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
              <Video className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {/* Helpful Count */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ThumbsUp className="h-4 w-4" />
          <span>Helpful ({review.helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}
