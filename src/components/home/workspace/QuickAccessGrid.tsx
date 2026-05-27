import { Link } from "react-router-dom";
import {
  Sparkles, BookOpenText, CalendarCheck2, LineChart, GraduationCap, Wand2,
  ShoppingBag, Gamepad2,
} from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";

type Tile = { icon: any; label: string; href: string };

const TILES: Tile[] = [
  { icon: BookOpenText,   label: "Continue", href: "/learn" },
  { icon: Sparkles,       label: "AI Tutor", href: "/learn" },
  { icon: CalendarCheck2, label: "Planner",  href: "/learn" },
  { icon: LineChart,      label: "Progress", href: "/profile" },
  { icon: GraduationCap,  label: "Mentors",  href: "/mentors" },
  { icon: Wand2,          label: "Prompts",  href: "/prompts" },
  { icon: ShoppingBag,    label: "Explore",  href: "/shop" },
  { icon: Gamepad2,       label: "Games",    href: "/game" },
];

export function QuickAccessGrid() {
  return (
    <Reveal as="section" className="section-x">
      <div className="flex items-end justify-between mb-2">
        <h2 className="font-semibold text-base">Quick Actions</h2>
        <Link to="/profile" className="text-xs text-foreground/70 hover:text-foreground font-medium">See all</Link>
      </div>

      {/* Mobile: single-row scroll, category-style chips */}
      <div className="md:hidden flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
        {TILES.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            to={href}
            className="shrink-0 flex flex-col items-center gap-1.5 pressable focus-ring"
          >
            <div className="w-14 h-14 rounded-2xl glass border border-border/60 flex items-center justify-center bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.18)]">
              <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-foreground/80">{label}</span>
          </Link>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-8 gap-3">
        {TILES.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            to={href}
            className="group focus-ring flex flex-col items-center gap-1.5 rounded-2xl py-2"
          >
            <div className="w-14 h-14 rounded-2xl glass border border-border/60 flex items-center justify-center bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.18)] group-hover:bg-white/[0.08] transition">
              <Icon className="h-5 w-5 text-primary" strokeWidth={2} />
            </div>
            <span className="text-[11.5px] font-medium text-foreground/85">{label}</span>
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
