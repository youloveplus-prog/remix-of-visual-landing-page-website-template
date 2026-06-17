import { Link } from "react-router-dom";
import {
  Sparkles, BookOpenText, CalendarCheck2, LineChart, GraduationCap, Wand2,
  ShoppingBag, Gamepad2, Users, MessageSquare, Bell, Heart, Trophy, Settings,
  HelpCircle, Bookmark, Video, Radio, Play, ChevronRight, Coins, Terminal,
} from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";

type Tile = { icon: any; label: string; href: string; kicker?: string };

const FEATURED: Tile = {
  icon: Play, label: "Continue Learning", href: "/learn", kicker: "Resume",
};

const ALL_TILES: Tile[] = [
  { icon: Sparkles,       label: "AI Tutor",  href: "/learn" },
  { icon: GraduationCap,  label: "Courses",   href: "/shop?type=courses" },
  { icon: Wand2,          label: "Prompts",   href: "/prompts" },
  { icon: Coins,          label: "Earn",      href: "/game" },
  { icon: Users,          label: "Mentors",   href: "/mentors" },
  { icon: BookOpenText,   label: "Library",   href: "/learn" },
  { icon: CalendarCheck2, label: "Planner",   href: "/learn" },
  { icon: LineChart,      label: "Progress",  href: "/profile" },
  { icon: ShoppingBag,    label: "Shop",      href: "/shop" },
  { icon: Gamepad2,       label: "Play",      href: "/game" },
  { icon: Video,          label: "Videos",    href: "/community" },
  { icon: Radio,          label: "Live",      href: "/community" },
  { icon: MessageSquare,  label: "Messages",  href: "/messages" },
  { icon: Bell,           label: "Alerts",    href: "/notifications" },
  { icon: Heart,          label: "Wishlist",  href: "/wishlist" },
  { icon: Bookmark,       label: "Saved",     href: "/profile" },
  { icon: Trophy,         label: "Rewards",   href: "/profile" },
  { icon: HelpCircle,     label: "Help",      href: "/contact" },
  { icon: Settings,       label: "Settings",  href: "/settings" },
];

function MiniTile({ icon: Icon, label, href, index = 0 }: Tile & { index?: number }) {
  return (
    <Link
      to={href}
      className="group flex flex-col items-center gap-1 pressable focus-ring animate-fade-in"
      style={{ animationDelay: `${index * 25}ms`, animationFillMode: "backwards" }}
    >
      <div className="h-11 w-11 rounded-2xl bg-card border border-border flex items-center justify-center transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:bg-primary/8">
        <Icon className="h-[18px] w-[18px] text-foreground/80 group-hover:text-primary transition-colors" strokeWidth={2} />
      </div>
      <span className="text-[10px] font-medium text-foreground/75 text-center leading-tight truncate w-full">
        {label}
      </span>
    </Link>
  );
}

export function QuickAccessGrid() {
  const Featured = FEATURED.icon;

  return (
    <Reveal as="section" className="section-x">
      {/* Header — compact */}
      <div className="flex items-end justify-between px-1 mb-3">
        <div className="flex items-baseline gap-2.5">
          <p className="text-[10px] font-bold tracking-[0.22em] text-primary uppercase font-mono flex items-center gap-1.5">
            <Terminal className="h-3 w-3" /> Dashboard
          </p>
          <h2 className="font-display font-bold leading-none tracking-[-0.03em] text-[18px] text-foreground">
            Quick Actions
          </h2>
        </div>
      </div>

      {/* Compact featured banner */}
      <Link
        to={FEATURED.href}
        className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-primary text-primary-foreground px-4 py-3 mb-3 focus-ring pressable transition-all duration-300 hover:shadow-[0_14px_32px_-18px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5 animate-fade-in"
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-2xl pointer-events-none" />
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
          <Featured className="h-[18px] w-[18px] fill-current" strokeWidth={2.5} />
        </div>
        <div className="relative flex-1 min-w-0 text-left">
          <p className="text-[9px] font-bold text-white/75 uppercase tracking-[0.22em] font-mono leading-none mb-1">
            {FEATURED.kicker}
          </p>
          <h3 className="text-[14px] font-bold leading-tight truncate">
            {FEATURED.label} <span className="text-white/65 font-medium">· pick up where you left off</span>
          </h3>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-white/80 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
      </Link>

      {/* Dense all-access launcher */}
      <div className="rounded-[1.5rem] bg-card/60 border border-border p-3">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-x-2 gap-y-3">
          {ALL_TILES.map((t, i) => (
            <MiniTile key={t.label} {...t} index={i} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
