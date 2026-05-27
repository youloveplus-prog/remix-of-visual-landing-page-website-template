import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PlayCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLearnerProfile } from "@/hooks/useLearnerProfile";
import { db } from "@/lib/db";
import { MobileScroller } from "@/components/ui/mobile-scroller";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/transitions/Reveal";

function useResumeLessons() {
  const { user } = useAuth();
  const { data: profile } = useLearnerProfile();
  return useQuery({
    queryKey: ["resume-lessons", user?.id, profile?.active_track_id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async () => {
      const completionsQ = db
        .from("lesson_completions")
        .select("lesson_id")
        .eq("user_id", user!.id);
      const { data: comps } = await completionsQ;
      const doneIds = new Set((comps ?? []).map((r: any) => r.lesson_id));
      if (!profile?.active_track_id) return [];
      const { data: lessons } = await db
        .from("lessons")
        .select("id, title, duration_min, order, track_id, tracks(name, slug)")
        .eq("track_id", profile.active_track_id)
        .order("order");
      const next = (lessons ?? []).filter((l: any) => !doneIds.has(l.id)).slice(0, 6);
      return next as any[];
    },
  });
}

export function ContinueLearningRow() {
  const { data: lessons } = useResumeLessons();
  if (!lessons || lessons.length === 0) return null;

  return (
    <Reveal as="section">
      <div className="section-x">
        <SectionHeader title="Continue learning" subtitle="Pick up where you left off" viewAllHref="/learn" />
      </div>
      <MobileScroller itemWidthMobile="72%" gridCols="md:grid md:grid-cols-3" gap="gap-3">
        {lessons.map((l: any) => (
          <Link
            key={l.id}
            to={`/lesson/${l.id}`}
            className="group h-full rounded-2xl bg-card border border-border p-4 focus-ring flex flex-col transition-colors hover:border-foreground/30"
          >
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground mb-1">{l.tracks?.name ?? "Track"}</p>
            <p className="font-semibold text-sm line-clamp-2 mb-3 group-hover:opacity-70 transition-opacity">{l.title}</p>
            <div className="mt-auto flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" /> {l.duration_min} min
              </span>
              <PlayCircle className="h-5 w-5 text-foreground" />
            </div>
          </Link>
        ))}
      </MobileScroller>
    </Reveal>
  );
}
