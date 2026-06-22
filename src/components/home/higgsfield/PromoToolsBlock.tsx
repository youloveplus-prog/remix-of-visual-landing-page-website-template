import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Sparkles,
  GraduationCap,
  Wand2,
  Bot,
  Users,
  BookOpen,
  Gamepad2,
} from "lucide-react";

type Tile = {
  icon: typeof Sparkles;
  title: string;
  desc: string;
  to: string;
  badge?: { label: string; tone: "new" | "trending" | "free" };
  kicker?: string;
};

const TILES: Tile[] = [
  { icon: GraduationCap, title: "Courses", desc: "Project-based, certified tracks", to: "/shop?type=courses", badge: { label: "Hot", tone: "trending" }, kicker: "Learn" },
  { icon: Bot, title: "AI Tutor", desc: "Voice + chat learning companion", to: "/learn", badge: { label: "New", tone: "new" }, kicker: "AI" },
  { icon: Wand2, title: "Prompts", desc: "200+ curated AI prompts", to: "/prompts", badge: { label: "Free", tone: "free" }, kicker: "Library" },
  { icon: Users, title: "Mentors", desc: "1-on-1 tutors for kids", to: "/mentors", kicker: "1:1" },
  { icon: BookOpen, title: "Resources", desc: "Guides, events, downloads", to: "/resources", badge: { label: "Free", tone: "free" }, kicker: "Read" },
  { icon: Gamepad2, title: "Game", desc: "Earn coins while you learn", to: "/game", kicker: "Play" },
];

function useCountdown(targetMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, targetMs - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function PromoToolsBlock() {
  const target = typeof window !== "undefined"
    ? (window as any).__asikonSale ?? ((window as any).__asikonSale = Date.now() + 1000 * 60 * 60 * 12)
    : Date.now() + 1000 * 60 * 60 * 12;
  const countdown = useCountdown(target);

  const toneCls: Record<string, string> = {
    new: "bg-[hsl(var(--hf-accent))] text-white",
    trending: "bg-white text-black",
    free: "bg-white/10 text-white border border-white/15",
  };

  return (
    <section className="hf-section px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-3 lg:grid-cols-[360px_1fr]">
        {/* Promo card */}
        <Link
          to="/shop?sale=skillup"
          className="group relative isolate flex h-full min-h-[260px] flex-col justify-between overflow-hidden rounded-[16px] border border-white/10 p-5"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--hf-accent)) 0%, #1b2566 55%, #050714 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(closest-side, #ffffff, transparent)" }}
          />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--hf-accent))]" />
              Expires in {countdown}
            </span>
          </div>
          <div>
            <div className="font-display text-[34px] font-extrabold uppercase leading-[1.08] tracking-tight text-white">
              27-DAY
              <br />
              <span className="text-white/90">UNLIMITED</span>
              <br />
              <span className="italic text-white">SKILL-UP</span>
            </div>
            <p className="mt-3 max-w-[22ch] text-xs text-white/70">
              Unlock every course, prompt library and the AI Tutor for one flat fee.
            </p>
            <div className="mt-5 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-black transition group-hover:-translate-y-0.5">
              Get 27-day Unlimited Offer
            </div>
          </div>
        </Link>

        {/* Tools grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {TILES.map(({ icon: Icon, ...t }) => (
            <Link
              key={t.title}
              to={t.to}
              className="group relative flex h-full min-h-[122px] flex-col justify-between overflow-hidden rounded-[14px] border border-white/10 bg-neutral-950 p-4 transition hover:border-[hsl(var(--hf-accent))] hover:bg-neutral-900"
            >
              <div className="flex items-start justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/90 transition group-hover:text-[hsl(var(--hf-accent))]">
                  <Icon className="h-4 w-4" />
                </div>
                {t.badge && (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${toneCls[t.badge.tone]}`}>
                    {t.badge.label}
                  </span>
                )}
              </div>
              <div>
                {t.kicker && (
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    {t.kicker}
                  </div>
                )}
                <div className="mt-1 font-display text-base font-semibold text-white">
                  {t.title}
                </div>
                <div className="text-xs text-white/55">{t.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
