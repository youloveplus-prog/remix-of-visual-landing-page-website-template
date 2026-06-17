import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ReviewSortBy = "top" | "newest";
export type ReviewRatingFilter = "all" | 1 | 2 | 3 | 4 | 5;

export interface ProductReviewRow {
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

export interface UseProductReviewsParams {
  productId: string | undefined;
  sortBy: ReviewSortBy;
  ratingFilter: ReviewRatingFilter;
  verifiedOnly: boolean;
  withPhotos: boolean;
  limit?: number;
}

interface ReviewQueryRow {
  id: string;
  rating: number;
  title: string;
  content: string;
  images: string[] | null;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

export function useProductReviews({
  productId,
  sortBy,
  ratingFilter,
  verifiedOnly,
  withPhotos,
  limit = 50,
}: UseProductReviewsParams) {
  const [reviews, setReviews] = useState<ProductReviewRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      let q = supabase
        .from("product_reviews")
        .select(
          "id, rating, title, content, images, is_verified_purchase, helpful_count, created_at, profiles!product_reviews_user_profile_fkey(display_name, avatar_url)",
        )
        .eq("product_id", productId);

      if (ratingFilter !== "all") q = q.eq("rating", ratingFilter);
      if (verifiedOnly) q = q.eq("is_verified_purchase", true);
      if (withPhotos) q = q.not("images", "eq", "{}");

      if (sortBy === "top") {
        q = q
          .order("helpful_count", { ascending: false })
          .order("created_at", { ascending: false });
      } else {
        q = q.order("created_at", { ascending: false });
      }

      const { data, error: err } = await q.limit(limit);
      if (cancelled) return;

      if (err) {
        setError(err.message);
        setReviews([]);
      } else {
        const rows = (data ?? []) as unknown as ReviewQueryRow[];
        setReviews(
          rows.map((r) => ({
            id: r.id,
            userName: r.profiles?.display_name ?? "Anonymous",
            userAvatar: r.profiles?.avatar_url ?? undefined,
            rating: r.rating,
            title: r.title,
            content: r.content,
            images: r.images ?? [],
            isVerifiedPurchase: r.is_verified_purchase,
            helpfulCount: r.helpful_count,
            createdAt: r.created_at,
          })),
        );
      }
      setLoading(false);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [productId, sortBy, ratingFilter, verifiedOnly, withPhotos, limit]);

  return { reviews, loading, error };
}
