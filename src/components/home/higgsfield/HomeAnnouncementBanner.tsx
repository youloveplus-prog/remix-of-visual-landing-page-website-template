import { useEffect, useState } from "react";
import { X, Megaphone, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useHomeAnnouncements, type HomeAnnouncement } from "@/hooks/useHomeAnnouncements";

const DISMISS_KEY = "home-announcements-dismissed";

function readDismissed(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(DISMISS_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}
function persistDismissed(s: Set<string>) {
  try { sessionStorage.setItem(DISMISS_KEY, JSON.stringify([...s])); } catch {}
}

function levelStyles(level: HomeAnnouncement["level"]) {
  switch (level) {
    case "success":
      return { ring: "ring-emerald-400/30", bg: "bg-emerald-500/10", icon: CheckCircle2, fg: "text-emerald-300" };
    case "warning":
      return { ring: "ring-amber-400/30", bg: "bg-amber-500/10", icon: AlertTriangle, fg: "text-amber-300" };
    case "promo":
      return { ring: "ring-fuchsia-400/30", bg: "bg-fuchsia-500/10", icon: Sparkles, fg: "text-fuchsia-300" };
    default:
      return { ring: "ring-sky-400/30", bg: "bg-sky-500/10", icon: Megaphone, fg: "text-sky-300" };
  }
}

export function HomeAnnouncementBanner() {
  const { data } = useHomeAnnouncements();
  const [dismissed, setDismissed] = useState<Set<string>>(() => readDismissed());

  useEffect(() => { persistDismissed(dismissed); }, [dismissed]);

  const pinned = (data ?? []).filter((a) => a.is_pinned && !dismissed.has(a.id));
  if (pinned.length === 0) return null;

  return (
    <div className="mt-6 px-4 sm:px-6 lg:px-8">
      <div className="space-y-2">
        {pinned.map((a) => {
          const s = levelStyles(a.level);
          const Icon = s.icon;
          const inner = (
            <div className={`flex items-start gap-3 rounded-2xl border border-white/10 ring-1 ${s.ring} ${s.bg} px-4 py-3`}>
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 ${s.fg}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{a.title}</p>
                {a.body && <p className="mt-0.5 text-xs text-white/70">{a.body}</p>}
              </div>
              <button
                type="button"
                aria-label="Dismiss announcement"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDismissed((prev) => new Set(prev).add(a.id));
                }}
                className="shrink-0 rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
          return a.link ? (
            <Link key={a.id} to={a.link} className="block">{inner}</Link>
          ) : (
            <div key={a.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
