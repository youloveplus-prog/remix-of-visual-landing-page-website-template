import { Link } from "react-router-dom";
import {
  Search,
  LayoutGrid,
  Bell,
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

const pillActions = [
  { icon: ShoppingBag, label: "Shop", href: "/shop", tone: "text-sky-500 bg-sky-500/10" },
  { icon: GraduationCap, label: "Courses", href: "/shop?type=courses", tone: "text-emerald-500 bg-emerald-500/10" },
  { icon: Sparkles, label: "AI Tutor", href: "/ai-tutor", tone: "text-violet-500 bg-violet-500/10" },
  { icon: Tag, label: "Deals", href: "/shop?filter=deals", tone: "text-pink-500 bg-pink-500/10" },
  { icon: Bookmark, label: "Saved", href: "/profile", tone: "text-amber-500 bg-amber-500/10" },
];

const activityTiles = [
  { icon: BookOpen, label: "All courses", href: "/shop?type=courses", tone: "text-sky-500 bg-sky-500/10" },
  { icon: PlayCircle, label: "In progress", href: "/profile", tone: "text-emerald-500 bg-emerald-500/10" },
  { icon: CheckCircle2, label: "Completed", href: "/profile", tone: "text-violet-500 bg-violet-500/10" },
  { icon: Heart, label: "Wishlist", href: "/profile", tone: "text-pink-500 bg-pink-500/10" },
  { icon: Plus, label: "Add goal", href: "/profile", tone: "text-amber-500 bg-amber-500/10" },
];

const brands = [
  { name: "Python", letter: "Py" },
  { name: "OpenAI", letter: "AI" },
  { name: "React", letter: "R" },
  { name: "Figma", letter: "F" },
  { name: "Notion", letter: "N" },
  { name: "Linux", letter: "L" },
];

export function FlexiTopSection() {
  return (
    <section className="section-x space-y-4 pt-2">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/shop"
          aria-label="Browse"
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center focus-ring"
        >
          <LayoutGrid className="h-4 w-4 text-foreground" />
        </Link>
        <span className="font-display font-bold tracking-[0.2em] text-foreground text-sm">ASIKON</span>
        <Link
          to="/profile"
          aria-label="Notifications"
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center focus-ring relative"
        >
          <Bell className="h-4 w-4 text-foreground" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </Link>
      </div>

      {/* Search */}
      <Link
        to="/shop"
        className="midnight-tile flex items-center gap-3 px-4 h-12 focus-ring"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Search & learn anywhere</span>
      </Link>

      {/* Pill action row */}
      <div className="grid grid-cols-5 gap-2">
        {pillActions.map(({ icon: Icon, label, href, tone }) => (
          <Link
            key={label}
            to={href}
            className="flex flex-col items-center gap-1.5 focus-ring rounded-2xl pressable"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium text-foreground">{label}</span>
          </Link>
        ))}
      </div>

      {/* Dark CTA banner */}
      <Link
        to="/shop"
        className="flex items-center justify-between rounded-2xl bg-foreground text-background px-4 py-4 focus-ring pressable"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display font-bold text-sm">Start learning today</p>
            <p className="text-[11px] opacity-70">Pick a path in one tap</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 opacity-70" />
      </Link>

      {/* Two-stat split card */}
      <div className="midnight-tile grid grid-cols-2 divide-x divide-border">
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <p className="font-display font-bold text-base text-foreground">120+</p>
            <p className="text-[11px] text-muted-foreground">Lessons</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="font-display font-bold text-base text-foreground">24/7</p>
            <p className="text-[11px] text-muted-foreground">AI Tutor</p>
          </div>
        </div>
      </div>

      {/* Activity quick grid */}
      <div className="grid grid-cols-5 gap-2">
        {activityTiles.map(({ icon: Icon, label, href, tone }) => (
          <Link
            key={label}
            to={href}
            className="flex flex-col items-center gap-1.5 focus-ring rounded-2xl pressable"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tone}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium text-foreground text-center leading-tight">{label}</span>
          </Link>
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
              <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center font-display font-bold text-sm text-foreground">
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
