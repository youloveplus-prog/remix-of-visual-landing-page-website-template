import { supabase } from "@/integrations/supabase/client";

export interface PlaybackRow {
  position_seconds: number;
  duration_seconds: number | null;
  updated_at: string;
}

/** Fetch saved position for the signed-in user, or null. */
export async function fetchPlayback(userId: string, slug: string): Promise<PlaybackRow | null> {
  const { data, error } = await supabase
    .from("course_playback" as any)
    .select("position_seconds, duration_seconds, updated_at")
    .eq("user_id", userId)
    .eq("course_slug", slug)
    .maybeSingle();
  if (error) return null;
  return (data as unknown as PlaybackRow | null) ?? null;
}

/** Upsert latest position. Best-effort — failures are swallowed. */
export async function savePlayback(
  userId: string,
  slug: string,
  positionSeconds: number,
  durationSeconds: number | null,
): Promise<void> {
  await supabase.from("course_playback" as any).upsert(
    {
      user_id: userId,
      course_slug: slug,
      position_seconds: Math.max(0, positionSeconds),
      duration_seconds: durationSeconds,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_slug" },
  );
}

/** Remove saved position (e.g. when video ends). */
export async function clearPlayback(userId: string, slug: string): Promise<void> {
  await supabase
    .from("course_playback" as any)
    .delete()
    .eq("user_id", userId)
    .eq("course_slug", slug);
}
