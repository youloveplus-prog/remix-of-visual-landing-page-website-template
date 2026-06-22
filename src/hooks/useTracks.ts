import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/db";
import { useAuth } from "./useAuth";

export interface Track {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface Lesson {
  id: string;
  track_id: string;
  order: number;
  title: string;
  outcome: string | null;
  duration_min: number;
  content_md: string | null;
  video_url: string | null;
  transcript: string | null;
  pdf_url: string | null;
  is_preview: boolean;
}

/** Returns [] when the underlying table is missing instead of throwing — keeps the UI rendering until tracks ship. */
async function safeSelect<T>(fn: () => Promise<{ data: any; error: any }>): Promise<T[]> {
  try {
    const { data, error } = await fn();
    if (error) {
      // PGRST205 = relation not found in PostgREST schema cache
      if ((error as any)?.code === "PGRST205") return [];
      throw error;
    }
    return (data ?? []) as T[];
  } catch (err: any) {
    if (err?.code === "PGRST205") return [];
    throw err;
  }
}

export function useTracks() {
  return useQuery<Track[]>({
    queryKey: ["tracks"],
    queryFn: () =>
      safeSelect<Track>(() =>
        db.from("tracks").select("*").eq("is_active", true).order("display_order"),
      ),
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useTrack(slug?: string) {
  return useQuery<Track | null>({
    queryKey: ["track", slug],
    enabled: !!slug,
    retry: false,
    queryFn: async () => {
      const rows = await safeSelect<Track>(() =>
        db.from("tracks").select("*").eq("slug", slug).limit(1),
      );
      return rows[0] ?? null;
    },
  });
}

export function useTrackLessons(trackId?: string) {
  return useQuery<Lesson[]>({
    queryKey: ["track_lessons", trackId],
    enabled: !!trackId,
    retry: false,
    queryFn: () =>
      safeSelect<Lesson>(() =>
        db.from("lessons").select("*").eq("track_id", trackId).order("order"),
      ),
  });
}

export function useLesson(id?: string) {
  return useQuery<Lesson | null>({
    queryKey: ["lesson", id],
    enabled: !!id,
    retry: false,
    queryFn: async () => {
      const rows = await safeSelect<Lesson>(() =>
        db.from("lessons").select("*").eq("id", id).limit(1),
      );
      return rows[0] ?? null;
    },
  });
}

export function useLessonCompletions() {
  const { user } = useAuth();
  return useQuery<Set<string>>({
    queryKey: ["lesson_completions", user?.id],
    enabled: !!user,
    retry: false,
    queryFn: async () => {
      const rows = await safeSelect<{ lesson_id: string }>(() =>
        db.from("lesson_completions").select("lesson_id").eq("user_id", user!.id),
      );
      return new Set(rows.map((r) => r.lesson_id));
    },
    staleTime: 30_000,
  });
}
