import { Link } from "react-router-dom";
import { useTracks } from "@/hooks/useTracks";

const FALLBACK = [
  { id: "f1", slug: "ai-foundations", name: "AI Foundations", description: "From zero to building real AI projects." },
  { id: "f2", slug: "python-mastery", name: "Python Mastery", description: "Syntax, data, web, and automation." },
  { id: "f3", slug: "creative-design", name: "Creative Design", description: "Brand, UI, and motion for makers." },
];

const PROGRESS = [62, 28, 84];

export function TracksSection() {
  const { data } = useTracks();
  const tracks = (data && data.length ? data : FALLBACK).slice(0, 3);

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="font-display text-xl sm:text-2xl font-medium tracking-tight text-white">
          Learning tracks
        </h2>
        <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          Structured paths
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {tracks.map((t, i) => (
          <Link
            key={t.id}
            to={`/track/${t.slug}`}
            className="group flex flex-col justify-between rounded-[10px] border border-white/10 bg-neutral-950 p-5 hover:border-[hsl(var(--hf-accent))]/50"
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                Track {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-2 font-display text-xl font-semibold text-white">
                {t.name}
              </div>
              <p className="mt-1 text-[13px] text-white/55 line-clamp-2">
                {t.description ?? "Project-based path with certified outcomes."}
              </p>
            </div>
            <div className="mt-6">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-[hsl(var(--hf-accent))]"
                  style={{ width: `${PROGRESS[i] ?? 50}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-white/40">
                <span>{PROGRESS[i] ?? 50}% complete</span>
                <span className="group-hover:text-[hsl(var(--hf-accent))]">Open →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
