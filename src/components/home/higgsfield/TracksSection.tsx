import { Link } from "react-router-dom";
import { useTracks, useTrackLessons, useLessonCompletions } from "@/hooks/useTracks";
import { Skeleton } from "@/components/ui/skeleton";

export function TracksSection() {
  const { data: tracks = [], isLoading } = useTracks();
  const visible = tracks.slice(0, 3);

  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="hf-title font-display text-white">Learning tracks</h2>
        <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          Structured paths
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-[10px] bg-white/5" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-[10px] border border-white/10 bg-neutral-950 p-6 text-center text-[13px] text-white/55">
          New tracks are coming soon. Check back shortly.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {visible.map((t, i) => (
            <TrackCard key={t.id} track={t} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}

function TrackCard({ track, index }: { track: { id: string; slug: string; name: string; description: string | null }; index: number }) {
  const { data: lessons = [] } = useTrackLessons(track.id);
  const { data: done } = useLessonCompletions();
  const total = lessons.length;
  const completed = lessons.filter((l) => done?.has(l.id)).length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <Link
      to={`/track/${track.slug}`}
      className="group flex flex-col justify-between rounded-[10px] border border-white/10 bg-neutral-950 p-5 hover:border-[hsl(var(--hf-accent))]/50"
    >
      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
          Track {String(index + 1).padStart(2, "0")}
        </div>
        <div className="mt-2 font-display text-xl font-semibold text-white">{track.name}</div>
        <p className="mt-1 text-[13px] text-white/55 line-clamp-2">
          {track.description ?? "Project-based path with certified outcomes."}
        </p>
      </div>
      <div className="mt-6">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-[hsl(var(--hf-accent))]" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/40">
          <span>
            {total === 0 ? "Coming soon" : `${pct}% complete`}
          </span>
          <span className="group-hover:text-[hsl(var(--hf-accent))]">Open →</span>
        </div>
      </div>
    </Link>
  );
}
