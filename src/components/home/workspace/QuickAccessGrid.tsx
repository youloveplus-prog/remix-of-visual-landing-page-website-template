import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, BookOpenText, CalendarCheck2, LineChart, GraduationCap, Wand2,
  ShoppingBag, Gamepad2, Users, MessageSquare, Bell, Heart, Trophy, Settings,
  HelpCircle, Bookmark, Video, Radio,
} from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Tile = { icon: any; label: string; href: string };

const TILES: Tile[] = [
  { icon: BookOpenText,   label: "Continue", href: "/learn" },
  { icon: Sparkles,       label: "AI Tutor", href: "/learn" },
  { icon: GraduationCap,  label: "Courses",  href: "/shop?type=courses" },
  { icon: Wand2,          label: "Prompts",  href: "/prompts" },
  { icon: Gamepad2,       label: "Earn",     href: "/game" },
  { icon: Users,          label: "Mentors",  href: "/mentors" },
];

const ALL_TILES: Tile[] = [
  ...TILES,
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

function TileLink({ icon: Icon, label, href, onClick, index = 0 }: Tile & { onClick?: () => void; index?: number }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 pressable focus-ring group animate-fade-in"
      style={{ animationDelay: `${index * 45}ms`, animationFillMode: "backwards" }}
    >
      <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-[0_10px_24px_-12px_hsl(var(--primary)/0.55)] group-hover:bg-primary/5">
        <Icon className="h-5 w-5 text-foreground transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" strokeWidth={2} />
      </div>
      <span className="text-[11px] font-medium text-foreground/80 text-center leading-tight">{label}</span>
    </Link>
  );
}

export function QuickAccessGrid() {
  const [open, setOpen] = useState(false);

  return (
    <Reveal as="section" className="section-x">
      <div className="flex flex-col items-center text-center gap-1 mb-4">
        <h2 className="font-display font-bold leading-[0.95] tracking-[-0.035em] text-[26px] sm:text-[34px] text-brand-gradient">Quick Actions</h2>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">
              See all
            </button>
          </SheetTrigger>

          <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-left">All Quick Actions</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-4 gap-4 pb-6">
              {ALL_TILES.map((t, i) => (
                <TileLink key={t.label} {...t} index={i} onClick={() => setOpen(false)} />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* 6 tiles in 2 rows of 3 — mobile + desktop */}
      <div className="grid grid-cols-3 gap-3">
        {TILES.map((t, i) => (
          <TileLink key={t.label} {...t} index={i} />
        ))}
      </div>
    </Reveal>
  );
}
