import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ContentKind = "digital" | "course" | "service";

export interface ContentItem {
  id: string;
  kind: ContentKind;
  title: string;
  slug: string;
  summary: string | null;
  description_md: string | null;
  cover_url: string | null;
  gallery: string[];
  price: number;
  original_price: number | null;
  currency: string;
  is_free: boolean;
  category: string | null;
  tags: string[];
  level: string | null;
  language: string;
  duration_min: number;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  display_order: number;
  instructor_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useContentItems(opts: { kind?: ContentKind; admin?: boolean; limit?: number } = {}) {
  const { kind, admin = false, limit = 100 } = opts;
  return useQuery({
    queryKey: ["content_items", { kind, admin, limit }],
    queryFn: async () => {
      let q = supabase.from("content_items").select("*").order("created_at", { ascending: false }).limit(limit);
      if (kind) q = q.eq("kind", kind);
      if (!admin) q = q.eq("status", "published");
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ContentItem[];
    },
  });
}

export function useContentItem(slug: string) {
  return useQuery({
    queryKey: ["content_item", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data as ContentItem | null;
    },
  });
}

export function useMyPurchases() {
  return useQuery({
    queryKey: ["my_content_purchases"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) return [];
      const { data, error } = await supabase
        .from("content_purchases")
        .select("item_id, granted_at, content_items(*)")
        .eq("user_id", u.user.id);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export async function getSignedAssetUrl(asset_id: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("get-content-asset-url", {
    body: { asset_id },
  });
  if (error) throw error;
  return (data as any).url as string;
}
