import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Types are not in generated client yet — cast through any until types regen.
const db: any = supabase;

export interface NextTopic {
  topic_id: string;
  slug: string;
  display_name: string;
  subject: string | null;
  chapter: string | null;
  mastery_score: number;
  reason: string;
}

/**
 * Returns the weakest unlocked curriculum topic for the signed-in learner.
 * Drives "Today's Mission" topic recommendations and the Socratic tutor's
 * opening diagnostic prompt.
 */
export function useNextTopic() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["next-topic", user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async (): Promise<NextTopic | null> => {
      const { data, error } = await db.rpc("get_next_recommended_topic");
      if (error) throw error;
      const row = Array.isArray(data) ? data[0] : data;
      return row
        ? {
            topic_id: row.topic_id,
            slug: row.slug,
            display_name: row.display_name,
            subject: row.subject ?? null,
            chapter: row.chapter ?? null,
            mastery_score: Number(row.mastery_score ?? 0),
            reason: row.reason ?? "",
          }
        : null;
    },
  });
}

export interface TopicMasteryRow {
  topic_id: string;
  slug: string;
  display_name: string;
  subject: string | null;
  chapter: string | null;
  mastery_score: number;
  attempts: number;
  last_practiced_at: string | null;
}

/**
 * Per-topic mastery rows for the signed-in learner — joins learner_mastery
 * with curriculum_topics for the radar/table in SkillMap.
 */
export function useTopicMastery() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["topic-mastery", user?.id],
    enabled: !!user,
    staleTime: 30_000,
    queryFn: async (): Promise<TopicMasteryRow[]> => {
      const { data, error } = await db
        .from("learner_mastery")
        .select(
          "topic_id, mastery_score, attempts, last_practiced_at, curriculum_topics ( slug, display_name, subject, chapter )",
        )
        .eq("user_id", user!.id)
        .order("last_practiced_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as any[]).map((r) => ({
        topic_id: r.topic_id,
        slug: r.curriculum_topics?.slug ?? "",
        display_name: r.curriculum_topics?.display_name ?? "Untitled topic",
        subject: r.curriculum_topics?.subject ?? null,
        chapter: r.curriculum_topics?.chapter ?? null,
        mastery_score: Number(r.mastery_score ?? 0),
        attempts: r.attempts ?? 0,
        last_practiced_at: r.last_practiced_at ?? null,
      }));
    },
  });
}
