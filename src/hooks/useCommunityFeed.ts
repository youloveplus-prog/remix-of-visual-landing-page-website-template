import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Post, User } from "@/types";

interface CommunityPostRow {
  id: string;
  user_id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  content: string;
  images: string[] | null;
  likes: number;
  comments: number;
  shares: number;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.max(1, Math.floor(diff / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function rowToPost(row: CommunityPostRow): Post & { createdAt: string } {
  const user: User = {
    id: row.user_id,
    name: row.display_name,
    username: row.username,
    avatar:
      row.avatar_url ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(row.display_name)}`,
    followers: 0,
    following: 0,
    sales: 0,
    trustScore: 0,
    coins: 0,
    level: "Bronze",
  };
  return {
    id: row.id,
    user,
    content: row.content,
    images: row.images ?? [],
    likes: row.likes,
    comments: row.comments,
    shares: row.shares,
    timestamp: timeAgo(row.created_at),
    createdAt: row.created_at,
  };
}

export function useCommunityFeed(limit = 12) {
  const [rows, setRows] = useState<CommunityPostRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const justArrivedRef = useRef<Set<string>>(new Set());
  const [arrivedVersion, setArrivedVersion] = useState(0);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!active) return;
      setRows((data as CommunityPostRow[] | null) ?? []);
      setIsLoading(false);
    })();

    const channel = supabase
      .channel("community_posts_feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_posts" },
        (payload) => {
          const row = payload.new as CommunityPostRow;
          justArrivedRef.current.add(row.id);
          setArrivedVersion((v) => v + 1);
          setRows((prev) => [row, ...prev.filter((r) => r.id !== row.id)].slice(0, limit));
          setTimeout(() => {
            justArrivedRef.current.delete(row.id);
            setArrivedVersion((v) => v + 1);
          }, 60_000);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "community_posts" },
        (payload) => {
          const row = payload.new as CommunityPostRow;
          setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...row } : r)));
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "community_posts" },
        (payload) => {
          const id = (payload.old as { id?: string })?.id;
          if (id) setRows((prev) => prev.filter((r) => r.id !== id));
        },
      )
      .subscribe();

    const interval = setInterval(() => setTick((t) => t + 1), 30_000);

    return () => {
      active = false;
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [limit]);

  const posts = useMemo(
    () => rows.map(rowToPost),
    // re-render every 30s for relative timestamps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, tick],
  );

  const liveCount = useMemo(() => {
    const fiveMinAgo = Date.now() - 5 * 60_000;
    return rows.filter((r) => new Date(r.created_at).getTime() > fiveMinAgo).length;
  }, [rows, tick]);

  const isNew = useMemo(() => {
    const set = new Set(justArrivedRef.current);
    return (id: string) => set.has(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivedVersion]);

  return { posts, isLoading, liveCount, isNew };
}
