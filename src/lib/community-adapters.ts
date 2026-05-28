/**
 * Adapters mapping Supabase `posts` rows → existing community card shapes.
 * Keeps tab queries thin and existing card components untouched.
 */
import type { Post, User } from "@/types";

type ProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_verified?: boolean | null;
  trust_score?: number | null;
} | null;

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
  profiles?: ProfileRow;
};

const FALLBACK_AVATAR =
  "https://api.dicebear.com/7.x/initials/svg?seed=A&backgroundColor=475569";

function formatTime(iso: string): string {
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

function toUser(p: ProfileRow, fallbackId: string): User {
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
    user: toUser(row.profiles ?? null, row.user_id),
    content: row.content ?? "",
    images: row.images ?? undefined,
    likes: 0,
    comments: 0,
    shares: 0,
    timestamp: formatTime(row.created_at),
  };
}

export { formatTime };
