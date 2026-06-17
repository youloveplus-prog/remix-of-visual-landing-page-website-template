import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, BookOpenText, CalendarCheck2, LineChart, GraduationCap, Wand2,
  ShoppingBag, Gamepad2, Users, MessageSquare, Bell, Heart, Trophy, Settings,
  HelpCircle, Bookmark, Video, Radio, Play, ChevronRight, Coins, Terminal,
} from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Tile = { icon: any; label: string; href: string; kicker?: string };

const FEATURED: Tile = {
  icon: Play, label: "Continue Learning", href: "/learn", kicker: "Resume",
};

const TILES: Tile[] = [
  { icon: Sparkles,       label: "AI Tutor", href: "/learn",            kicker: "Helper" },
  { icon: GraduationCap,  label: "Courses",  href: "/shop?type=courses", kicker: "Library" },
  { icon: Wand2,          label: "Prompts",  href: "/prompts",           kicker: "Tools" },
  { icon: Coins,          label: "Earn",     href: "/game",              kicker: "Rewards" },
  { icon: Users,          label: "Mentors",  href: "/mentors",           kicker: "Experts" },
];

const ALL_TILES: Tile[] = [
  { icon: BookOpenText,   label: "Continue", href: "/learn" },
  { icon: Sparkles,       label: "AI Tutor", href: "/learn" },
  { icon: GraduationCap,  label: "Courses",  href: "/shop?type=courses" },
  { icon: Wand2,          label: "Prompts",  href: "/prompts" },
  { icon: Gamepad2,       label: "Earn",     href: "/game" },
  { icon: Users,          label: "Mentors",  href: "/mentors" },
  { icon: CalendarCheck2, label: "Planner",   href: "/learn" },
  { icon: LineChart,      label: "Progress",  href: "/profile" },
  { icon: ShoppingBag,    label: "Explore",   href: "/shop" },
  { icon: MessageSquare,  label: "Messages",  href: "/messages" },
  { icon: Bell,           label: "Alerts",    href: "/notifications" },
  { icon: Heart,          label: "Wishlist",  href: "/wishlist" },
  { icon: Bookmark,       label: "Saved",     href: "/profile" },
  { icon: Trophy,         label: "Rewards",   href: "/profile" },
  { icon: Video,          label: "Videos",    href: "/community" },
  { icon: Radio,          label: "Live",      href: "/community" },
  { icon: HelpCircle,     label: "Help",      href: "/contact" },
  { icon: Settings,       label: "Settings",  href: "/settings" },
];

function SheetTile({ icon: Icon, label, href, onClick, index = 0 }: Tile & { onClick?: () => void; index?: number }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 pressable focus-ring group animate-fade-in"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: "backwards" }}
    >
      <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:bg-primary/5">
        <Icon className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" strokeWidth={2} />
      </div>
      <span className="text-[11px] font-medium text-foreground/80 text-center leading-tight">{label}</span>
    </Link>
  );
}

function BentoTile({ icon: Icon, label, href, kicker, index = 0 }: Tile & { index?: number }) {
  return (
    <Link
      to={href}
      className="group relative flex flex-col justify-between rounded-[1.75rem] bg-card border border-border p-4 min-h-[120px] focus-ring pressable transition-all duration-300 hover:border-primary/30 hover:shadow-[0_10px_28px_-16px_hsl(var(--primary)/0.45)] hover:-translate-y-0.5 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
    >
      <div className="h-10 w-10 rounded-2xl bg-primary/8 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="text-left mt-3">
        {kicker && (
          <p className="text-[9px] font-bold text-primary/80 uppercase tracking-[0.18em] font-mono mb-0.5">
            {kicker}
          </p>
        )}
        <h3 className="text-sm font-bold text-foreground leading-tight">{label}</h3>
      </div>
    </Link>
  );
}

export function QuickAccessGrid() {
  const [open, setOpen] = useState(false);
  const Featured = FEATURED.icon;

  return (
    <Reveal as="section" className="section-x">
      {/* Header */}
      <div className="flex items-end justify-between px-1 mb-5">
        <div className="space-y-1">
          <p className="text-[10px] font-bold tracking-[0.22em] text-primary uppercase font-mono flex items-center gap-1.5">
            <Terminal className="h-3 w-3" /> Dashboard
          </p>
          <h2 className="font-display font-bold leading-[0.95] tracking-[-0.035em] text-[24px] sm:text-[30px] text-foreground">
            Quick Actions
          </h2>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="group flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary hover:text-primary/80 transition-colors font-mono">
              See all
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-left">All Quick Actions</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-4 gap-4 pb-6">
              {ALL_TILES.map((t, i) => (
                <SheetTile key={t.label} {...t} index={i} onClick={() => setOpen(false)} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Featured + bento grid */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to={FEATURED.href}
          className="group relative col-span-2 overflow-hidden rounded-[1.75rem] bg-primary text-primary-foreground p-5 focus-ring pressable transition-all duration-300 hover:shadow-[0_18px_40px_-18px_hsl(var(--primary)/0.7)] hover:-translate-y-0.5 animate-fade-in"
        >
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/15 blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="space-y-1.5 text-left min-w-0">
              <p className="text-[10px] font-bold text-white/75 uppercase tracking-[0.22em] font-mono">
                {FEATURED.kicker}
              </p>
              <h3 className="text-lg sm:text-xl font-bold leading-tight truncate">
                {FEATURED.label}
              </h3>
              <p className="text-[11px] text-white/70 leading-snug">
                Pick up right where you left off →
              </p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
              <Featured className="h-5 w-5 fill-current" strokeWidth={2.5} />
            </div>
          </div>
        </Link>

        {TILES.map((t, i) => (
          <BentoTile key={t.label} {...t} index={i + 1} />
        ))}
      </div>
    </Reveal>
  );
}
