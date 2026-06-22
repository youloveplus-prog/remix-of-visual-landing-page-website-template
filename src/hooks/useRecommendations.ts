import { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useMentors } from "@/hooks/useMentors";
import type { RailItem } from "@/components/connect/RelatedRail";

export type RecommendationContext =
  | { kind: "course"; slug?: string; categoryId?: string | null }
  | { kind: "product"; slug?: string; categoryId?: string | null }
  | { kind: "resource"; slug?: string }
  | { kind: "lesson"; id?: string; topicId?: string | null }
  | { kind: "mentor"; id?: string }
  | { kind: "home" };

interface UseRecommendationsResult {
  items: RailItem[];
  isLoading: boolean;
}

/**
 * Returns ordered RailItem[] for the "Related" rail on a given page.
 * Combines product, mentor, and (future) post/topic sources. Pure presentational
 * recommendation — no backend writes.
 */
export function useRecommendations(ctx: RecommendationContext): UseRecommendationsResult {
  const { data: products, isLoading: productsLoading } = useProducts({
    limit: 8,
    kinds: ctx.kind === "course" ? ["course"] : undefined,
  });
  const { data: mentors, isLoading: mentorsLoading } = useMentors();

  const items = useMemo<RailItem[]>(() => {
    const out: RailItem[] = [];

    (products ?? []).forEach((p: any) => {
      if ("slug" in ctx && p.slug === ctx.slug) return;
      out.push({
        id: p.id,
        kind: p.kind === "course" ? "course" : "product",
        title: p.name,
        subtitle: p.kind === "course" ? "Self-paced course" : undefined,
        image: p.image_url ?? undefined,
        to: p.kind === "course" ? `/courses/${p.slug}` : `/product/${p.slug}`,
      });
    });

    (mentors ?? []).slice(0, 3).forEach((m: any) => {
      out.push({
        id: m.id ?? m.user_id ?? m.slug ?? String(out.length),
        kind: "mentor",
        title: m.display_name ?? m.name ?? "Verified mentor",
        subtitle: m.subject ?? m.headline ?? "1-on-1 mentorship",
        image: m.avatar_url ?? undefined,
        to: "/mentors",
      });
    });

    return out.slice(0, 8);
  }, [products, mentors, ctx]);

  return { items, isLoading: productsLoading || mentorsLoading };
}
