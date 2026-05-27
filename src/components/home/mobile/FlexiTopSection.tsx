import { Link } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  Tag,
  Bookmark,
  ChevronRight,
  BookOpen,
  Bot,
  PlayCircle,
  CheckCircle2,
  Heart,
  Plus,
} from "lucide-react";

type Tile = {
  icon: typeof ShoppingBag;
  label: string;
  href: string;
  grad: string;
};

const pillActions: Tile[] = [
  { icon: ShoppingBag, label: "Shop", href: "/shop", grad: "from-blue-500 to-primary" },
  { icon: GraduationCap, label: "Courses", href: "/shop?type=courses", grad: "from-emerald-400 to-teal-500" },
  { icon: Sparkles, label: "AI Tutor", href: "/ai-tutor", grad: "from-violet-500 to-primary" },
  { icon: Tag, label: "Deals", href: "/shop?filter=deals", grad: "from-rose-500 to-primary" },
  { icon: Bookmark, label: "Saved", href: "/profile", grad: "from-amber-400 to-orange-500" },
];

const activityTiles: Tile[] = [
  { icon: BookOpen, label: "All courses", href: "/shop?type=courses", grad: "from-blue-500 to-primary" },
  { icon: PlayCircle, label: "In progress", href: "/profile", grad: "from-emerald-400 to-teal-500" },
  { icon: CheckCircle2, label: "Completed", href: "/profile", grad: "from-violet-500 to-primary" },
  { icon: Heart, label: "Wishlist", href: "/profile", grad: "from-rose-500 to-primary" },
  { icon: Plus, label: "Add goal", href: "/profile", grad: "from-amber-400 to-orange-500" },
];

const brands = [
  { name: "Python", letter: "Py" },
  { name: "OpenAI", letter: "AI" },
  { name: "React", letter: "R" },
  { name: "Figma", letter: "F" },
  { name: "Notion", letter: "N" },
  { name: "Linux", letter: "L" },
];

function PillTile({ icon: Icon, label, href, grad }: Tile) {
  return (
    <Link
      to={href}
      className="flex flex-col items-center gap-1.5 focus-ring rounded-2xl pressable group"
    >
      <div className="w-14 h-14 rounded-2xl bg-card border border-border/60 shadow-[0_4px_14px_-6px_hsl(var(--primary)/0.25)] flex items-center justify-center transition-transform group-active:scale-95">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white shadow-[0_4px_10px_-3px_hsl(var(--primary)/0.45)]`}>
          <Icon className="h-4 w-4" strokeWidth={2.4} />
        </div>
      </div>
      <span className="text-[11px] font-semibold text-foreground">{label}</span>
    </Link>
  );
}

export function FlexiTopSection() {
  return (
    <section className="section-x space-y-5 pt-2">
      {/* Search */}
      <Link
        to="/shop"
        className="flex items-center gap-3 px-5 h-12 rounded-full bg-card border border-border/60 shadow-[0_4px_18px_-8px_hsl(var(--primary)/0.25)] focus-ring"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search & learn anywhere</span>
      </Link>

      {/* Pill action row */}
      <div className="grid grid-cols-5 gap-2">
        {pillActions.map((t) => (
          <PillTile key={t.label} {...t} />
        ))}
      </div>

      {/* Brand CTA banner */}
      <Link
        to="/shop"
        className="relative overflow-hidden flex items-center justify-between rounded-2xl px-4 py-4 focus-ring pressable text-primary-foreground shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.55)]"
        style={{ background: "var(--gradient-primary)" }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display font-bold text-[15px] leading-tight">Start learning today</p>
            <p className="text-[11px] opacity-80 mt-0.5">Pick a path in one tap</p>
          </div>
        </div>
        <ChevronRight className="relative h-4 w-4 opacity-90" />
      </Link>

      {/* Two-stat split card */}
      <div className="rounded-2xl bg-card border border-border/60 shadow-[0_6px_20px_-12px_hsl(var(--primary)/0.25)] grid grid-cols-2 divide-x divide-border/60 overflow-hidden">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display font-bold text-base text-foreground">120+</p>
            <p className="text-[11px] text-muted-foreground">Lessons</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display font-bold text-base text-foreground">24/7</p>
            <p className="text-[11px] text-muted-foreground">AI Tutor</p>
          </div>
        </div>
      </div>

      {/* Activity quick grid */}
      <div className="grid grid-cols-5 gap-2">
        {activityTiles.map((t) => (
          <PillTile key={t.label} {...t} />
        ))}
      </div>

      {/* Top Brands */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-foreground">Top Brands</h2>
          <Link to="/shop" className="text-xs font-semibold text-primary">See all</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1">
          {brands.map((b) => (
            <Link
              key={b.name}
              to="/shop"
              className="flex flex-col items-center gap-1.5 shrink-0 focus-ring"
            >
              <div className="w-14 h-14 rounded-2xl bg-card border border-border/60 shadow-[0_4px_14px_-6px_hsl(var(--primary)/0.2)] flex items-center justify-center font-display font-bold text-sm text-foreground">
                {b.letter}
              </div>
              <span className="text-[11px] font-medium text-foreground">{b.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
