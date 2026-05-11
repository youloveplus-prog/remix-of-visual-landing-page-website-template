import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mockProducts } from "@/lib/mock-data";

// Fallback products shaped to match the Supabase `products` table
const fallbackProducts = mockProducts.map((p, i) => ({
  id: p.id,
  name: p.name,
  slug: `product-${p.id}`,
  image_url: p.image,
  price: p.price,
  original_price: p.originalPrice ?? null,
  rating: p.rating,
  review_count: p.reviews,
  is_featured: !!p.isTrending,
  is_pod: false,
  category_id: null as string | null,
  created_at: new Date(Date.now() - i * 1000).toISOString(),
}));

export type SortOption = "newest" | "price-asc" | "price-desc" | "rating" | "popular";

interface UseProductsOptions {
  categoryId?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: SortOption;
  isPod?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { categoryId, featured, limit = 20, search, minPrice, maxPrice, sortBy = "newest", isPod } = options;

  return useQuery({
    queryKey: ["products", { categoryId, featured, limit, search, minPrice, maxPrice, sortBy, isPod }],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*");

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (featured !== undefined) {
        query = query.eq("is_featured", featured);
      }

      if (isPod !== undefined) {
        query = query.eq("is_pod", isPod);
      }

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      if (minPrice !== undefined) {
        query = query.gte("price", minPrice);
      }

      if (maxPrice !== undefined) {
        query = query.lte("price", maxPrice);
      }

      // Apply sorting
      switch (sortBy) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false });
          break;
        case "popular":
          query = query.order("review_count", { ascending: false });
          break;
        case "newest":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      query = query.limit(limit);

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useProducts({ featured: true, limit });
}

export function useProductsByCategory(categoryId: string, limit = 20) {
  return useProducts({ categoryId, limit });
}
