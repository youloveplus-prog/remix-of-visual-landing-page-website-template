import { Link } from "react-router-dom";
import {
  Sparkles, BookOpenText, CalendarCheck2, LineChart, GraduationCap, Wand2,
  ShoppingBag, Gamepad2, Users, MessageSquare, Bell, Heart, Trophy, Settings,
  HelpCircle, Bookmark, Video, Radio, Play, ChevronDown, Coins, Terminal,
} from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/transitions/Reveal";

type Tile = { icon: any; label: string; href: string; tint: string };

const FEATURED = {
  icon: Play, label: "Continue Learning", href: "/learn", kicker: "Resume",
};

// Distinct accent tints (HSL) per tile — playful but on-brand
const ALL_TILES: Tile[] = [
  { icon: Sparkles,       label: "AI Tutor",  href: "/learn",             tint: "233 72% 55%" },
  { icon: GraduationCap,  label: "Courses",   href: "/shop?type=courses", tint: "199 89% 48%" },
  { icon: Wand2,          label: "Prompts",   href: "/prompts",           tint: "271 76% 53%" },
  { icon: Coins,          label: "Earn",      href: "/game",              tint: "32 95% 50%"  },
  { icon: Users,          label: "Mentors",   href: "/mentors",           tint: "340 82% 52%" },
  { icon: BookOpenText,   label: "Library",   href: "/learn",             tint: "160 70% 40%" },
  { icon: CalendarCheck2, label: "Planner",   href: "/learn",             tint: "12 88% 55%"  },
  { icon: LineChart,      label: "Progress",  href: "/profile",           tint: "199 89% 48%" },
  { icon: ShoppingBag,    label: "Shop",      href: "/shop",              tint: "340 82% 52%" },
  { icon: Gamepad2,       label: "Play",      href: "/game",              tint: "271 76% 53%" },
  { icon: Video,          label: "Videos",    href: "/community",         tint: "12 88% 55%"  },
  { icon: Radio,          label: "Live",      href: "/community",         tint: "0 84% 55%"   },
  { icon: MessageSquare,  label: "Messages",  href: "/messages",          tint: "233 72% 55%" },
  { icon: Bell,           label: "Alerts",    href: "/notifications",     tint: "32 95% 50%"  },
  { icon: Heart,          label: "Wishlist",  href: "/wishlist",          tint: "340 82% 52%" },
  { icon: Bookmark,       label: "Saved",     href: "/profile",           tint: "199 89% 48%" },
  { icon: Trophy,         label: "Rewards",   href: "/profile",           tint: "45 95% 50%"  },
  { icon: HelpCircle,     label: "Help",      href: "/contact",           tint: "160 70% 40%" },
  { icon: Settings,       label: "Settings",  href: "/settings",          tint: "220 12% 45%" },
];

const COLLAPSED_COUNT = 8;

function MiniTile({ icon: Icon, label, href, tint, index = 0 }: Tile & { index?: number }) {
  return (
    <Link
      to={href}
      className="group flex flex-col items-center gap-1.5 pressable focus-ring animate-fade-in min-w-0"
      style={{ animationDelay: `${index * 20}ms`, animationFillMode: "backwards" }}
    >
      <div
        className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-card border border-border flex items-center justify-center transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_20px_-12px_hsl(var(--foreground)/0.25)]"
        style={{ borderColor: `hsl(${tint} / 0.18)` }}
      >
        <div
          className="absolute inset-1.5 rounded-full opacity-90"
          style={{ background: `hsl(${tint} / 0.10)` }}
          aria-hidden
        />
        <Icon
          className="relative h-[18px] w-[18px] sm:h-5 sm:w-5"
          strokeWidth={2.2}
          style={{ color: `hsl(${tint})` }}
        />
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium text-foreground/80 text-center leading-tight truncate w-full px-0.5">
        {label}
      </span>
    </Link>
  );
}

export function QuickAccessGrid() {
  const [expanded, setExpanded] = useState(false);
  const Featured = FEATURED.icon;
  const visible = expanded ? ALL_TILES : ALL_TILES.slice(0, COLLAPSED_COUNT);

  return (
    <Reveal as="section" className="section-x">
      {/* Header — compact */}
      <div className="flex items-end justify-between px-1 mb-2.5">
        <div className="flex items-baseline gap-2.5 min-w-0">
          <p className="text-[10px] font-bold tracking-[0.22em] text-primary uppercase font-mono flex items-center gap-1.5 shrink-0">
            <Terminal className="h-3 w-3" /> Dashboard
          </p>
          <h2 className="font-display font-bold leading-none tracking-[-0.03em] text-[16px] sm:text-[18px] text-foreground truncate">
            Quick Actions
          </h2>
        </div>
      </div>

      {/* Compact featured banner */}
      <Link
        to={FEATURED.href}
        className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-primary text-primary-foreground px-3.5 py-2.5 sm:py-3 mb-3 focus-ring pressable transition-all duration-300 hover:shadow-[0_14px_32px_-18px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5 animate-fade-in"
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-2xl pointer-events-none" />
        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          <Featured className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] fill-current" strokeWidth={2.5} />
        </div>
        <div className="relative flex-1 min-w-0 text-left">
          <p className="text-[9px] font-bold text-white/75 uppercase tracking-[0.22em] font-mono leading-none mb-1">
            {FEATURED.kicker}
          </p>
          <h3 className="text-[13px] sm:text-[14px] font-bold leading-tight truncate">
            {FEATURED.label}
            <span className="hidden sm:inline text-white/65 font-medium"> · pick up where you left off</span>
          </h3>
        </div>
      </Link>

      {/* Dense all-access launcher — bKash-style circular icons */}
      <div className="rounded-[1.5rem] bg-card/60 border border-border p-3 sm:p-4">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-x-2 gap-y-3.5 sm:gap-y-4">
          {visible.map((t, i) => (
            <MiniTile key={t.label} {...t} index={i} />
          ))}
        </div>

        {ALL_TILES.length > COLLAPSED_COUNT && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="group inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary font-mono hover:bg-primary/10 transition-colors focus-ring"
            >
              {expanded ? "Show less" : "See all"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                strokeWidth={2.5}
              />
            </button>
          </div>
        )}
      </div>
    </Reveal>
  );
}
