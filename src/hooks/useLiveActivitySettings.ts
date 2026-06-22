import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LiveActivitySettings {
  id: string;
  purchases_enabled: boolean;
  reviews_enabled: boolean;
  enrolments_enabled: boolean;
  milestones_enabled: boolean;
  toast_enabled: boolean;
  toast_interval_seconds: number;
  feed_window_hours: number;
  updated_at: string;
}

const DEFAULTS: LiveActivitySettings = {
  id: "global",
  purchases_enabled: true,
  reviews_enabled: true,
  enrolments_enabled: true,
  milestones_enabled: true,
  toast_enabled: true,
  toast_interval_seconds: 18,
  feed_window_hours: 24,
  updated_at: new Date().toISOString(),
};

export function useLiveActivitySettings() {
  return useQuery({
    queryKey: ["live-activity-settings"],
    queryFn: async (): Promise<LiveActivitySettings> => {
      const { data, error } = await (supabase as any)
        .from("live_activity_settings")
        .select("*")
        .eq("id", "global")
        .maybeSingle();
      if (error) throw error;
      return (data ?? DEFAULTS) as LiveActivitySettings;
    },
    staleTime: 60_000,
  });
}

export function useUpdateLiveActivitySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<LiveActivitySettings>) => {
      const { data, error } = await (supabase as any)
        .from("live_activity_settings")
        .upsert({ id: "global", ...patch }, { onConflict: "id" })
        .select()
        .single();
      if (error) throw error;
      return data as LiveActivitySettings;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["live-activity-settings"] }),
  });
}
