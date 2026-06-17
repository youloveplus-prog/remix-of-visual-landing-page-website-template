import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns the number of distinct product card impressions logged today for a
 * given product. Used for social-proof microcopy on the product detail page
 * ("42 people viewed this today"). Falls back to 0 on any error so the UI can
 * silently hide the chip instead of throwing.
 */
export function useProductViewsToday(productId: string | undefined) {
  return useQuery({
    queryKey: ["product-views-today", productId],
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      if (!productId) return 0;
      const since = new Date();
      since.setHours(0, 0, 0, 0);
      try {
        const { count, error } = await (supabase as any)
          .from("product_impressions")
          .select("id", { count: "exact", head: true })
          .eq("product_id", productId)
          .gte("created_at", since.toISOString());
        if (error) return 0;
        return count ?? 0;
      } catch {
        return 0;
      }
    },
  });
}
