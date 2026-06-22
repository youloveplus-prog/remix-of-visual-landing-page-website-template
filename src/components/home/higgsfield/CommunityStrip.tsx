import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const AVATARS = Array.from({ length: 10 }).map(
  (_, i) => `https://i.pravatar.cc/80?img=${i + 11}`,
);

export function CommunityStrip() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10">
      <Link
        to="/community"
        className="group flex items-center justify-between gap-6 rounded-[10px] border border-white/10 bg-neutral-950 p-5 hover:border-[hsl(var(--hf-accent))]/50"
      >
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {AVATARS.slice(0, 6).map((a, i) => (
              <img
                key={i}
                src={a}
                alt=""
                className="h-9 w-9 rounded-full border-2 border-black object-cover"
              />
            ))}
          </div>
          <div>
            <div className="text-[15px] font-semibold text-white">
              12,400+ learners shipping this week
            </div>
            <div className="text-[12px] text-white/50">
              See posts, projects, and reviews from the community
            </div>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--hf-accent))]">
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </section>
  );
}
