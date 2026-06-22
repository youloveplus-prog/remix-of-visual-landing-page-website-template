import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fallbackCategories = [
  { id: "c1", name: "Courses", slug: "courses", icon: "🎓" },
  { id: "c2", name: "Books", slug: "books", icon: "📚" },
  { id: "c3", name: "Student Kits", slug: "kits", icon: "🎒" },
  { id: "c4", name: "Prompt Library", slug: "prompts", icon: "🪄" },
  { id: "c5", name: "AI Tutor", slug: "ai-tutor", icon: "🤖" },
  { id: "c6", name: "Gadgets", slug: "gadgets", icon: "💻" },
];

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
