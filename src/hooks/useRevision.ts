import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type RevisionItem = {
  id: string;
  lesson_id: string;
  topic: string | null;
  ease: number;
  interval_days: number;
  repetitions: number;
  last_grade: number | null;
  next_due_at: string;
  lessons?: { id: string; title: string; track_id: string } | null;
};

export function useRevisionDue(limit = 20) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["revision-due", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("revision_items")
        .select("*, lessons(id, title, track_id)")
        .eq("user_id", user!.id)
        .lte("next_due_at", new Date().toISOString())
        .order("next_due_at", { ascending: true })
        .limit(limit);
      if (error) throw error;
      return (data ?? []) as RevisionItem[];
    },
  });
}

export function useRevisionStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["revision-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const now = new Date().toISOString();
      const [dueRes, totalRes] = await Promise.all([
        supabase
          .from("revision_items")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user!.id)
          .lte("next_due_at", now),
        supabase
          .from("revision_items")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user!.id),
      ]);
      return { due: dueRes.count ?? 0, total: totalRes.count ?? 0 };
    },
  });
}

export function useGradeRevision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ lessonId, grade }: { lessonId: string; grade: number }) => {
      const { data, error } = await supabase.rpc("schedule_revision", {
        _lesson_id: lessonId,
        _grade: grade,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["revision-due"] });
      qc.invalidateQueries({ queryKey: ["revision-stats"] });
    },
  });
}
