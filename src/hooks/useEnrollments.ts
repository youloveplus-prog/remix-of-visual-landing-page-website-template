import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Enrollment {
  id: string;
  user_id: string;
  item_id: string;
  progress: number;
  completed_at: string | null;
  enrolled_at: string;
}

export interface EnrollmentWithItem extends Enrollment {
  content_items: {
    id: string;
    title: string;
    slug: string;
    cover_url: string | null;
    kind: string;
    summary: string | null;
    duration_min: number;
  } | null;
}

export function useEnrollments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["enrollments", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, content_items(id, title, slug, cover_url, kind, summary, duration_min)")
        .eq("user_id", user!.id)
        .order("enrolled_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as EnrollmentWithItem[];
    },
  });
}

export function useEnrollInCourse() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item_id: string) => {
      if (!user) throw new Error("Sign in to enroll");
      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: user.id, item_id })
        .select()
        .single();
      if (error && !error.message.toLowerCase().includes("duplicate")) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}

export function useUpdateEnrollmentProgress() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ item_id, progress }: { item_id: string; progress: number }) => {
      if (!user) throw new Error("Sign in required");
      const updates: any = { progress };
      if (progress >= 100) updates.completed_at = new Date().toISOString();
      const { error } = await supabase
        .from("enrollments")
        .update(updates)
        .eq("user_id", user.id)
        .eq("item_id", item_id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enrollments"] }),
  });
}
