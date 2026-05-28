/**
 * Adapters mapping Supabase `posts` rows → existing community card shapes.
 * Posts table has no declared FK to profiles, so we fetch profiles separately
 * and hydrate them into rows via `hydrateWithProfiles`.
 */
import type { Post, User } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export type ProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_verified?: boolean | null;
  trust_score?: number | null;
};

export type PostRow = {
  id: string;
  content: string | null;
  images: string[] | null;
  video_url: string | null;
  rating: number | null;
  type: string;
  user_id: string;
  created_at: string;
  product_id?: string | null;
  profile?: ProfileRow | null;
};

const FALLBACK_AVATAR =
  "https://api.dicebear.com/7.x/initials/svg?seed=A&backgroundColor=475569";

export function formatTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - then);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

function toUser(p: ProfileRow | null | undefined, fallbackId: string): User {
  const name = p?.full_name || p?.username || "Learner";
  return {
    id: p?.id ?? fallbackId,
    name,
    username: p?.username || name,
    avatar: p?.avatar_url || FALLBACK_AVATAR,
    isVerified: !!p?.is_verified,
    followers: 0,
    following: 0,
    sales: 0,
    trustScore: p?.trust_score ?? 0,
    coins: 0,
    level: "Bronze",
  };
}

export function adaptPost(row: PostRow): Post {
  return {
    id: row.id,
    user: toUser(row.profile, row.user_id),
    content: row.content ?? "",
    images: row.images ?? undefined,
    likes: 0,
    comments: 0,
    shares: 0,
    timestamp: formatTime(row.created_at),
  };
}

/** Fetches matching profiles for a list of post rows and attaches as `profile`. */
export async function hydrateWithProfiles<T extends { user_id: string }>(
  rows: T[]
): Promise<(T & { profile: ProfileRow | null })[]> {
  if (rows.length === 0) return [];
  const ids = Array.from(new Set(rows.map((r) => r.user_id)));
  const { data } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, is_verified, trust_score")
    .in("id", ids);
  const byId = new Map<string, ProfileRow>();
  (data ?? []).forEach((p: any) => byId.set(p.id, p));
  return rows.map((r) => ({ ...r, profile: byId.get(r.user_id) ?? null }));
}
