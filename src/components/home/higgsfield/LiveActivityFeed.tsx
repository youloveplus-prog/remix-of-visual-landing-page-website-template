import { useLiveActivity } from "@/hooks/useLiveActivity";
import {
  describeActivity,
  activityEmoji,
  timeAgoLabel,
} from "@/lib/live-activity";
import { HomeAnnouncementBanner } from "./HomeAnnouncementBanner";

/**
 * Home-page section that shows a live, auto-rotating stream of recent
 * purchases, reviews, enrolments and milestones. Reads from Supabase and
 * respects the admin-controlled `live_activity_settings`.
 */
export function LiveActivityFeed() {
  const { data: items = [], isLoading } = useLiveActivity(8);

  return (
    <>
      <HomeAnnouncementBanner />
      <section className="mt-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live on Asikon
            </div>
            <h2 className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
              Happening right now
            </h2>
          </div>
          <span className="text-[11px] text-white/40">auto-updating</span>
        </div>

        {isLoading && items.length === 0 ? (
          <ul className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={i}
                className="h-[60px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
              />
            ))}
          </ul>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-white/50">
            No activity yet — be the first to make a move.
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((a, idx) => {
              const { title, description } = describeActivity(a);
              return (
                <li
                  key={a.id}
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-sm transition-colors hover:bg-white/[0.06]"
                  style={{
                    animation: "live-slide-in 360ms ease-out both",
                    opacity: idx === 0 ? 1 : Math.max(0.55, 1 - idx * 0.06),
                  }}
                >
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-lg"
                  >
                    {activityEmoji(a.kind)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white">
                      <span className="font-medium">{title}</span>{" "}
                      <span className="text-white/60">{description}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-white/40">
                      {timeAgoLabel(a.occurredAt)} · verified
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <style>{`
          @keyframes live-slide-in {
            from { opacity: 0; transform: translateY(-6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>
    </>
  );
}
