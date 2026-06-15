import { useMemo } from "react";
import { ProductCarousel } from "@/components/carousels";
import { useProducts } from "@/hooks/useProducts";
import { useLearnerProfile } from "@/hooks/useLearnerProfile";
import { Skeleton } from "@/components/ui/skeleton";

const transform = (p: any) => ({
  id: p.id,
  name: p.name,
  brand: "Asikon Academy",
  price: p.price,
  originalPrice: p.original_price || undefined,
  image: p.image_url || "/placeholder.svg",
  rating: p.rating || 0,
  reviews: p.review_count || 0,
  isNew: false,
  isTrending: p.is_featured || false,
  slug: p.slug,
});

/**
 * v1 heuristic recommendations: prefer products tagged with the learner's goal
 * keyword (matched on name/description), fall back to featured items.
 * Phase 5 will swap this for a real recommendation service.
 */
export function RecommendedForYou() {
  const { data: profile } = useLearnerProfile();
  const { data: products, isLoading } = useProducts({ limit: 30 });

  const items = useMemo(() => {
    if (!products) return [];
    const goal = (profile?.goal || "").toLowerCase().trim();
    const interests = (profile?.interests || []).map((s) => s.toLowerCase());
    const keywords = [goal, ...interests].filter(Boolean);

    const matches = keywords.length
      ? products.filter((p: any) => {
          const hay = `${p.name ?? ""} ${p.description ?? ""}`.toLowerCase();
          return keywords.some((k) => k && hay.includes(k));
        })
      : [];

    const list = matches.length >= 4
      ? matches
      : [...matches, ...products.filter((p: any) => !matches.includes(p))].slice(0, 12);

    return list.map(transform);
  }, [products, profile]);

  if (isLoading) {
    return (
      <div className="section-x">
        <Skeleton className="h-6 w-48 mb-3" />
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-56 w-44 rounded-xl shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <ProductCarousel
      products={items}
      title="Recommended for you"
      viewAllHref="/shop"
    />
  );
}
