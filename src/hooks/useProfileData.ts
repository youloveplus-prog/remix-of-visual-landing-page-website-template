import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Order list (RLS restricts to own orders). */
export function useUserOrders(userId?: string) {
  return useQuery({
    queryKey: ["user-orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`*, order_items (*, products (id, name, slug, image_url, price))`)
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Wishlist (RLS restricts to own). */
export function useUserWishlist(userId?: string) {
  return useQuery({
    queryKey: ["user-wishlist", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select(`*, products (*)`)
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

/** Library — completed lessons grouped by track. */
export function useUserLibrary(userId?: string) {
  return useQuery({
    queryKey: ["user-library", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lesson_completions")
        .select(`*, lessons (id, title, track_id, "order", tracks (id, name, slug, icon, description))`)
        .eq("user_id", userId!)
        .order("completed_at", { ascending: false });
      if (error) throw error;

      const byTrack = new Map<string, {
        track: { id: string; name: string; slug: string; icon: string | null; description: string | null };
        lessons: Array<{ id: string; title: string; completed_at: string }>;
      }>();
      for (const row of data ?? []) {
        const t = (row as any).lessons?.tracks;
        const l = (row as any).lessons;
        if (!t || !l) continue;
        if (!byTrack.has(t.id)) byTrack.set(t.id, { track: t, lessons: [] });
        byTrack.get(t.id)!.lessons.push({
          id: l.id,
          title: l.title,
          completed_at: row.completed_at as string,
        });
      }
      return Array.from(byTrack.values());
    },
  });
}

/** Learner stats from server: XP, streak, milestones, recent completions, weekly activity. */
export function useLearnerStats(userId?: string) {
  return useQuery({
    queryKey: ["learner-stats", userId],
    enabled: !!userId,
    queryFn: async () => {
      // Last 7 days starting from Monday of the current week
      const today = new Date();
      const jsDay = today.getDay(); // 0=Sun..6=Sat
      const daysFromMonday = (jsDay + 6) % 7;
      const monday = new Date(today);
      monday.setHours(0, 0, 0, 0);
      monday.setDate(today.getDate() - daysFromMonday);

      const [profile, milestones, completions, weekly] = await Promise.all([
        supabase.from("learner_profiles").select("xp, streak_days, longest_streak, last_active_at, active_track_id").eq("user_id", userId!).maybeSingle(),
        supabase.from("milestones").select("kind, unlocked_at").eq("user_id", userId!).order("unlocked_at", { ascending: false }),
        supabase.from("lesson_completions").select("id").eq("user_id", userId!),
        supabase.from("lesson_completions").select("completed_at").eq("user_id", userId!).gte("completed_at", monday.toISOString()),
      ]);

      const weeklyActivity = Array(7).fill(false) as boolean[];
      for (const row of weekly.data ?? []) {
        const d = new Date((row as any).completed_at);
        const idx = (d.getDay() + 6) % 7;
        weeklyActivity[idx] = true;
      }

      return {
        xp: profile.data?.xp ?? 0,
        streak: profile.data?.streak_days ?? 0,
        longestStreak: profile.data?.longest_streak ?? 0,
        lastActive: profile.data?.last_active_at ?? null,
        activeTrackId: profile.data?.active_track_id ?? null,
        milestones: milestones.data ?? [],
        lessonsCompleted: completions.data?.length ?? 0,
        weeklyActivity,
      };
    },
  });
}

/** Aggregate counts for the stat row. */
export function useProfileCounts(userId?: string) {
  return useQuery({
    queryKey: ["profile-counts", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [posts, followers, following, reviews] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", userId!),
        supabase.from("user_followers").select("id", { count: "exact", head: true }).eq("following_id", userId!),
        supabase.from("user_followers").select("id", { count: "exact", head: true }).eq("follower_id", userId!),
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("user_id", userId!).eq("type", "review"),
      ]);
      return {
        posts: posts.count ?? 0,
        followers: followers.count ?? 0,
        following: following.count ?? 0,
        reviews: reviews.count ?? 0,
      };
    },
  });
}
