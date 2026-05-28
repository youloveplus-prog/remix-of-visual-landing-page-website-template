import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SearchResults {
  products: Array<{ id: string; name: string; slug: string; image_url: string | null; price: number }>;
  courses: Array<{ id: string; title: string; slug: string; cover_url: string | null; price: number; is_free: boolean }>;
  digital: Array<{ id: string; title: string; slug: string; cover_url: string | null; price: number; is_free: boolean }>;
  services: Array<{ id: string; title: string; slug: string; cover_url: string | null; price: number; is_free: boolean }>;
  mentors: Array<{ id: string; name: string; slug: string; avatar_url: string | null; subjects: string[] }>;
  posts: Array<{ id: string; content: string | null; user_id: string }>;
}

const EMPTY: SearchResults = { products: [], courses: [], digital: [], services: [], mentors: [], posts: [] };

interface RpcRow {
  source: "product" | "content" | "mentor" | "post";
  id: string;
  kind: string | null;
  title: string | null;
  slug: string | null;
  image_url: string | null;
  price: number | null;
  is_free: boolean | null;
  extra: Record<string, unknown> | null;
  score: number;
}

function useDebounced<T>(value: T, ms = 250): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useGlobalSearch(rawQuery: string) {
  const query = useDebounced(rawQuery.trim(), 250);
  const enabled = query.length >= 2;

  return useQuery({
    queryKey: ["global-search", query],
    enabled,
    staleTime: 30_000,
    queryFn: async (): Promise<SearchResults> => {
      const { data, error } = await supabase.rpc("global_search", { q: query, per_source: 5 });
      if (error) throw error;
      const rows = (data ?? []) as RpcRow[];

      const out: SearchResults = { products: [], courses: [], digital: [], services: [], mentors: [], posts: [] };
      for (const r of rows) {
        if (r.source === "product") {
          if (out.products.length < 5)
            out.products.push({ id: r.id, name: r.title ?? "", slug: r.slug ?? "", image_url: r.image_url, price: Number(r.price ?? 0) });
        } else if (r.source === "content") {
          const item = { id: r.id, title: r.title ?? "", slug: r.slug ?? "", cover_url: r.image_url, price: Number(r.price ?? 0), is_free: !!r.is_free };
          if (r.kind === "course" && out.courses.length < 5) out.courses.push(item);
          else if (r.kind === "digital" && out.digital.length < 5) out.digital.push(item);
          else if (r.kind === "service" && out.services.length < 5) out.services.push(item);
        } else if (r.source === "mentor") {
          if (out.mentors.length < 5)
            out.mentors.push({
              id: r.id,
              name: r.title ?? "",
              slug: r.slug ?? "",
              avatar_url: r.image_url,
              subjects: (r.extra?.subjects as string[]) ?? [],
            });
        } else if (r.source === "post") {
          if (out.posts.length < 5)
            out.posts.push({ id: r.id, content: r.title, user_id: (r.extra?.user_id as string) ?? "" });
        }
      }
      return out;
    },
    placeholderData: (prev) => prev,
    initialData: enabled ? undefined : EMPTY,
  });
}

const RECENT_KEY = "asikon:recent-searches";
const MAX_RECENT = 6;

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]).slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export function pushRecentSearch(term: string) {
  const t = term.trim();
  if (!t) return;
  try {
    const cur = getRecentSearches().filter((x) => x.toLowerCase() !== t.toLowerCase());
    cur.unshift(t);
    localStorage.setItem(RECENT_KEY, JSON.stringify(cur.slice(0, MAX_RECENT)));
  } catch {
    /* ignore */
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    /* ignore */
  }
}

export const TRENDING_TERMS = [
  "AI courses",
  "Prompt engineering",
  "Free templates",
  "Mentorship",
  "Bangla tutorials",
  "Notion",
];
