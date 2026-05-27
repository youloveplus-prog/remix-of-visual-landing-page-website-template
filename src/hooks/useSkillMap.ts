import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SkillPoint = {
  track_id: string;
  track_name: string;
  mastery: number; // 0..100, blend of completion rate + recent quiz scores
  completion: number;
  avg_quiz: number | null;
};

/**
 * Mastery per active track.
 * mastery = 0.6 * completion% + 0.4 * avg(recent quiz score)
 * If no quiz data, mastery = completion%.
 */
export function useSkillMap() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["skill-map", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<SkillPoint[]> => {
      const [tracksRes, lessonsRes, completionsRes, attemptsRes] = await Promise.all([
        supabase.from("tracks").select("id, name").eq("is_active", true),
        supabase.from("lessons").select("id, track_id"),
        supabase.from("lesson_completions").select("lesson_id").eq("user_id", user!.id),
        supabase
          .from("quiz_attempts")
          .select("track_id, score_pct, created_at")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(200),
      ]);
      if (tracksRes.error) throw tracksRes.error;
      if (lessonsRes.error) throw lessonsRes.error;
      if (completionsRes.error) throw completionsRes.error;
      if (attemptsRes.error) throw attemptsRes.error;

      const tracks = tracksRes.data ?? [];
      const lessons = lessonsRes.data ?? [];
      const completed = new Set((completionsRes.data ?? []).map((c) => c.lesson_id));
      const attempts = attemptsRes.data ?? [];

      const lessonsByTrack = new Map<string, string[]>();
      for (const l of lessons) {
        if (!lessonsByTrack.has(l.track_id)) lessonsByTrack.set(l.track_id, []);
        lessonsByTrack.get(l.track_id)!.push(l.id);
      }

      return tracks.map((t) => {
        const trackLessons = lessonsByTrack.get(t.id) ?? [];
        const doneCount = trackLessons.filter((id) => completed.has(id)).length;
        const completion = trackLessons.length
          ? Math.round((doneCount / trackLessons.length) * 100)
          : 0;
        const trackQuizzes = attempts.filter((a) => a.track_id === t.id);
        const avgQuiz = trackQuizzes.length
          ? Math.round(trackQuizzes.reduce((s, a) => s + a.score_pct, 0) / trackQuizzes.length)
          : null;
        const mastery =
          avgQuiz == null ? completion : Math.round(completion * 0.6 + avgQuiz * 0.4);
        return {
          track_id: t.id,
          track_name: t.name,
          mastery,
          completion,
          avg_quiz: avgQuiz,
        };
      });
    },
  });
}
