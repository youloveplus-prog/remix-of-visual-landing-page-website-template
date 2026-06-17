import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const db: any = supabase;

export interface MentorVerification {
  id: string;
  mentor_id: string;
  status: "pending" | "verified" | "rejected";
  id_check: boolean;
  qualification_check: boolean;
  background_check: boolean;
  verified_at: string | null;
  notes: string | null;
}

/** Map of mentor_id → verification record for batch lookup on listing pages. */
export function useMentorVerificationsMap() {
  return useQuery({
    queryKey: ["mentor-verifications"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Record<string, MentorVerification>> => {
      const { data, error } = await db.from("mentor_verifications").select("*");
      if (error) throw error;
      const map: Record<string, MentorVerification> = {};
      for (const v of (data ?? []) as MentorVerification[]) map[v.mentor_id] = v;
      return map;
    },
  });
}

export function useUpsertMentorVerification() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (patch: Partial<MentorVerification> & { mentor_id: string }) => {
      const row = {
        ...patch,
        verified_by: patch.status === "verified" ? user?.id ?? null : null,
        verified_at: patch.status === "verified" ? new Date().toISOString() : null,
      };
      const { error } = await db
        .from("mentor_verifications")
        .upsert(row, { onConflict: "mentor_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mentor-verifications"] });
      toast.success("Verification updated");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update"),
  });
}

// ============= Parent ↔ student links =============
export interface ParentLink {
  id: string;
  parent_user_id: string;
  student_user_id: string;
  relationship: string;
  status: "pending" | "verified" | "revoked";
  verified_at: string | null;
}

export function useParentLinks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["parent-links", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<ParentLink[]> => {
      const { data, error } = await db
        .from("parent_links")
        .select("*")
        .or(`parent_user_id.eq.${user!.id},student_user_id.eq.${user!.id}`);
      if (error) throw error;
      return (data ?? []) as ParentLink[];
    },
  });
}

// ============= Session notes =============
export interface SessionNote {
  id: string;
  mentor_user_id: string;
  student_user_id: string | null;
  student_name: string;
  session_date: string;
  duration_minutes: number | null;
  topics_covered: string[];
  strengths: string | null;
  growth_areas: string | null;
  homework: string | null;
  created_at: string;
}

export function useSessionNotes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["session-notes", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<SessionNote[]> => {
      const { data, error } = await db
        .from("mentor_session_notes")
        .select("*")
        .order("session_date", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data ?? []) as SessionNote[];
    },
  });
}

export function useCreateSessionNote() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      input: Omit<SessionNote, "id" | "mentor_user_id" | "created_at"> & {
        mentor_id?: string | null;
      },
    ) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await db
        .from("mentor_session_notes")
        .insert({ ...input, mentor_user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["session-notes"] });
      toast.success("Session note saved");
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to save note"),
  });
}
