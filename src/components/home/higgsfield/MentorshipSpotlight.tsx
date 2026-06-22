import { Link } from "react-router-dom";
import { useMentors } from "@/hooks/useMentors";

const FALLBACK = [
  { id: "m1", name: "Rashida Khan", subjects: ["Math", "Science"], avatar_url: "https://i.pravatar.cc/200?img=47", experience_years: 8 },
  { id: "m2", name: "Tanvir Ahmed", subjects: ["Python", "AI"], avatar_url: "https://i.pravatar.cc/200?img=52", experience_years: 6 },
  { id: "m3", name: "Mahbuba Akter", subjects: ["English", "Writing"], avatar_url: "https://i.pravatar.cc/200?img=23", experience_years: 10 },
];

export function MentorshipSpotlight() {
  const { data } = useMentors();
  const mentors = (data && data.length ? data : FALLBACK).slice(0, 3);

  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="hf-title font-display text-white">
          1-on-1 mentors for your child
        </h2>
        <Link
          to="/mentors"
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60 hover:text-[hsl(var(--hf-accent))]"
        >
          Join waitlist →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {mentors.map((m: any) => (
          <div
            key={m.id}
            className="flex items-center gap-4 rounded-[10px] border border-white/10 bg-neutral-950 p-4"
          >
            <img
              src={m.avatar_url ?? "/placeholder.svg"}
              alt=""
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-white/10"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-semibold text-white">{m.name}</div>
              <div className="truncate text-[12px] text-white/55">
                {(m.subjects ?? []).slice(0, 3).join(" · ")}
              </div>
              <div className="mt-1 inline-flex items-center gap-2">
                <span className="rounded-sm bg-[hsl(var(--hf-accent))] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                  Waitlist
                </span>
                {m.experience_years != null && (
                  <span className="text-[11px] uppercase tracking-[0.14em] text-white/40">
                    {m.experience_years}y exp
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
