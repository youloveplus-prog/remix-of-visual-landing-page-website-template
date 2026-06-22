import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AnnouncementLevel = "info" | "success" | "warning" | "promo";

export interface HomeAnnouncement {
  id: string;
  title: string;
  body: string | null;
  level: AnnouncementLevel;
  link: string | null;
  is_active: boolean;
  is_pinned: boolean;
  show_as_toast: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Active announcements visible to the current viewer (uses RLS). */
export function useHomeAnnouncements() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["home-announcements"],
    queryFn: async (): Promise<HomeAnnouncement[]> => {
      const { data, error } = await (supabase as any)
        .from("home_announcements")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as HomeAnnouncement[];
    },
    staleTime: 30_000,
  });

  useEffect(() => {
    const channel = supabase
      .channel("home-announcements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "home_announcements" },
        () => qc.invalidateQueries({ queryKey: ["home-announcements"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);

  return query;
}

/** Admin: list every announcement regardless of active/scheduled state. */
export function useAllHomeAnnouncements() {
  return useQuery({
    queryKey: ["home-announcements", "admin", "all"],
    queryFn: async (): Promise<HomeAnnouncement[]> => {
      const { data, error } = await (supabase as any)
        .from("home_announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as HomeAnnouncement[];
    },
  });
}

export function useUpsertHomeAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: Partial<HomeAnnouncement> & { title: string }) => {
      const { data, error } = await (supabase as any)
        .from("home_announcements")
        .upsert(row)
        .select()
        .single();
      if (error) throw error;
      return data as HomeAnnouncement;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["home-announcements"] });
    },
  });
}

export function useDeleteHomeAnnouncement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("home_announcements")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["home-announcements"] }),
  });
}
