import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ProductKind } from "@/types";

const fallbackCategories = [
  { id: "c1", name: "Courses", slug: "courses", icon: "🎓" },
  { id: "c2", name: "Books", slug: "books", icon: "📚" },
  { id: "c3", name: "Student Kits", slug: "kits", icon: "🎒" },
  { id: "c4", name: "Prompt Library", slug: "prompts", icon: "🪄" },
  { id: "c5", name: "AI Tutor", slug: "ai-tutor", icon: "🤖" },
  { id: "c6", name: "Gadgets", slug: "gadgets", icon: "💻" },
];

/**
 * Maps each fallback category to the product `kind`s it represents. Used by
 * the seed-catalog filter in `useProducts` so picking "Books" returns only
 * ebooks, "Student Kits" returns only bundles, etc. — instead of every
 * category showing the same unfiltered list.
 *
 * Kept here (alongside the categories themselves) so the source of truth
 * stays in one place. When the real `categories` table ships, rows will
 * carry their own `category_id` on each product and this map becomes a
 * pure fallback.
 */
export const CATEGORY_KIND_FALLBACK: Record<string, ProductKind[]> = {
  c1: ["course"],
  c2: ["ebook"],
  c3: ["bundle"],
  c4: ["bundle"],
  c5: ["service"],
  c6: ["bundle", "ebook"],
};


export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error || !data || data.length === 0) return fallbackCategories;
      return data;
    },
    retry: 1,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}
