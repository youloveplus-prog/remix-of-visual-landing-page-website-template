import { Link } from "react-router-dom";
import {
  Bot,
  GraduationCap,
  Gamepad2,
  Sparkles,
  Users,
  BookOpen,
  ShoppingBag,
  MessageCircle,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tool = {
  name: string;
  desc: string;
  to: string;
  icon: LucideIcon;
  pill?: "NEW" | "HOT" | "FREE";
};

const TOOLS: Tool[] = [
  { name: "AI Tutor", desc: "Voice + chat learning companion", to: "/learn", icon: Bot, pill: "NEW" },
  { name: "Courses", desc: "Project-based, certified tracks", to: "/shop?type=courses", icon: GraduationCap, pill: "HOT" },
  { name: "Prompts", desc: "200+ curated AI prompts", to: "/prompts", icon: Wand2, pill: "FREE" },
  { name: "Mentors", desc: "1-on-1 tutors for kids", to: "/mentors", icon: Users },
  { name: "Community", desc: "Live posts, reviews, wins", to: "/community", icon: MessageCircle },
  { name: "Resources", desc: "Guides, events, downloads", to: "/resources", icon: BookOpen, pill: "FREE" },
  { name: "Game", desc: "Earn coins while you learn", to: "/game", icon: Gamepad2 },
  { name: "Shop", desc: "Books, kits, digital goods", to: "/shop", icon: ShoppingBag },
  { name: "What's new", desc: "Latest drops & releases", to: "/resources?tag=new", icon: Sparkles, pill: "NEW" },
];

const PILL_STYLES: Record<NonNullable<Tool["pill"]>, string> = {
  NEW: "bg-[hsl(var(--hf-accent))] text-white",
  HOT: "bg-red-500 text-white",
  FREE: "bg-white text-black",
};

export function ToolsBentoGrid() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Everything you need
        </h2>
        <span className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          {TOOLS.length} surfaces
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-3">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.name}
              to={t.to}
              className="group relative flex h-32 flex-col justify-between overflow-hidden rounded-[10px] border border-white/10 bg-neutral-950 p-4 transition-colors hover:border-[hsl(var(--hf-accent))]/50 hover:bg-neutral-900"
            >
              {t.pill && (
                <span
                  className={`absolute right-3 top-3 rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] ${PILL_STYLES[t.pill]}`}
                >
                  {t.pill}
                </span>
              )}
              <Icon className="h-6 w-6 text-white/80 transition-colors group-hover:text-[hsl(var(--hf-accent))]" />
              <div>
                <div className="text-[15px] font-semibold text-white">{t.name}</div>
                <div className="text-[12px] text-white/50">{t.desc}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
