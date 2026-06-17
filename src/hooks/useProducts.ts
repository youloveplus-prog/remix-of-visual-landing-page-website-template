import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mockProducts } from "@/lib/mock-data";
import { readCache, writeCache, cacheKey } from "@/lib/query-cache";
import { CATEGORY_KIND_FALLBACK } from "@/hooks/useCategories";
import { resolveProductImageUrls } from "@/lib/storage-urls";
import type { ProductKind } from "@/types";

// Fallback products shaped to match the Supabase `products` table.
// `kind` is carried through so consumers (Shop, carousels) can filter by
// content type even when running against the seed catalog.
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
  category_id: null as string | null,
  kind: (p.kind ?? "bundle") as ProductKind,
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
  /** Restrict results to these kinds (whitelist). Takes precedence over excludeKinds. */
  kinds?: ProductKind[];
  /** Drop results matching these kinds (blacklist). Use on /shop to hide courses & services. */
  excludeKinds?: ProductKind[];
}

export function useProducts(options: UseProductsOptions = {}) {
  const {
    categoryId,
    featured,
    limit = 20,
    search,
    minPrice,
    maxPrice,
    sortBy = "newest",
    kinds,
    excludeKinds,
  } = options;

  const ck = cacheKey([
    "products",
    { categoryId, featured, limit, search, minPrice, maxPrice, sortBy, kinds, excludeKinds },
  ]);
  return useQuery({
    queryKey: [
      "products",
      { categoryId, featured, limit, search, minPrice, maxPrice, sortBy, kinds, excludeKinds },
    ],
    initialData: () => readCache<any[]>(ck),
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

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      if (minPrice !== undefined) {
        query = query.gte("price", minPrice);
      }

      if (maxPrice !== undefined) {
        query = query.lte("price", maxPrice);
      }

      // Kind filtering — works when the real `products` table ships a
      // `kind` column. PostgREST silently ignores filters on missing
      // columns in newer versions; if it errors we fall back below.
      if (kinds && kinds.length > 0) {
        query = query.in("kind", kinds);
      } else if (excludeKinds && excludeKinds.length > 0) {
        query = query.not("kind", "in", `(${excludeKinds.map((k) => `"${k}"`).join(",")})`);
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

      // Race the network call against a short timeout so the page never waits
      // more than ~3.5s on a slow / blocked Supabase connection.
      const timeoutPromise = new Promise<{ data: null; error: { code: string; message: string } }>((resolve) =>
        setTimeout(
          () => resolve({ data: null, error: { code: "TIMEOUT", message: "Supabase request timed out" } }),
          3500,
        ),
      );
      const { data, error } = (await Promise.race([query, timeoutPromise])) as {
        data: any[] | null;
        error: any;
      };

      // "Relation does not exist" (42P01) or PostgREST "not found" (PGRST205)
      // means the products table hasn't been provisioned yet — fall back to
      // the seed catalog so the storefront still renders. Any OTHER error
      // (RLS denial, network failure, etc.) must surface to the user.
      const isMissingTable =
        error && (error.code === "42P01" || error.code === "PGRST205");
      const shouldFallback = isMissingTable || !data || data.length === 0;

      if (error && !isMissingTable && error.code !== "TIMEOUT") {
        throw new Error(error.message ?? "Failed to load products");
      }

      if (shouldFallback) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn(
            "[useProducts] Using seed catalog —",
            isMissingTable ? "products table not provisioned" : "no rows returned",
          );
        }
        let list = [...fallbackProducts];
        if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
        if (minPrice !== undefined) list = list.filter((p) => p.price >= minPrice);
        if (maxPrice !== undefined) list = list.filter((p) => p.price <= maxPrice);
        if (featured !== undefined) list = list.filter((p) => p.is_featured === featured);
        // Seed products carry no `category_id`, so map the requested category
        // to its kind whitelist and filter on that — this is why "Books",
        // "Student Kits", etc. used to all return the same items.
        if (categoryId) {
          const allowedForCategory = CATEGORY_KIND_FALLBACK[categoryId];
          if (allowedForCategory && allowedForCategory.length > 0) {
            const set = new Set<ProductKind>(allowedForCategory);
            list = list.filter((p) => set.has(p.kind));
          }
        }
        if (kinds && kinds.length > 0) {
          const allow = new Set(kinds);
          list = list.filter((p) => allow.has(p.kind));
        } else if (excludeKinds && excludeKinds.length > 0) {
          const deny = new Set(excludeKinds);
          list = list.filter((p) => !deny.has(p.kind));
        }
        switch (sortBy) {
          case "price-asc": list.sort((a, b) => a.price - b.price); break;
          case "price-desc": list.sort((a, b) => b.price - a.price); break;
          case "rating": list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
          case "popular": list.sort((a, b) => (b.review_count ?? 0) - (a.review_count ?? 0)); break;
        }
        const out = list.slice(0, limit);
        writeCache(ck, out);
        return out;
      }
      await resolveProductImageUrls(data!);
      writeCache(ck, data!);
      return data!;
    },
    retry: 0,
    staleTime: 5 * 60 * 1000,
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

      // Missing table (PGRST205 / 42P01) or empty row → fall back to seed
      // catalog so detail pages match what Shop/list pages render.
      const isMissingTable =
        error && (error.code === "42P01" || error.code === "PGRST205");
      if (data) {
        await resolveProductImageUrls([data]);
        return data;
      }

      if (import.meta.env.DEV && isMissingTable) {
        // eslint-disable-next-line no-console
        console.warn("[useProduct] Using seed catalog — products table not provisioned");
      }
      const fallback =
        fallbackProducts.find((p) => p.slug === slug) ??
        fallbackProducts.find((p) => p.id === slug) ??
        null;
      return fallback;
    },
    enabled: !!slug,
    retry: 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useProducts({ featured: true, limit });
}

export function useProductsByCategory(categoryId: string, limit = 20) {
  return useProducts({ categoryId, limit });
}
