import { Link } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  GraduationCap,
  Sparkles,
  Tag,
  ChevronRight,
  BookOpen,
  Bot,
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
];

function PillTile({ icon: Icon, label, href, grad }: Tile) {
  return (
    <Link
      to={href}
      className="flex flex-col items-center gap-2 focus-ring rounded-2xl pressable group"
    >
      <div
        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.5)] transition-transform group-active:scale-95`}
      >
        <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center text-white">
          <Icon className="h-4 w-4" strokeWidth={2.4} />
        </div>
      </div>
      <span className="text-[11px] font-semibold text-foreground">{label}</span>
    </Link>
  );
}

export function FlexiTopSection() {
  return (
    <section className="section-x space-y-4 pt-2">
      {/* Search */}
      <Link
        to="/shop"
        className="relative flex items-center gap-3 px-5 h-12 rounded-full bg-card border border-border/60 shadow-[0_4px_18px_-8px_hsl(var(--primary)/0.25)] focus-ring overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] to-transparent pointer-events-none" />
        <Search className="relative h-4 w-4 text-muted-foreground" />
        <span className="relative flex-1 text-sm text-muted-foreground">Search & learn anywhere</span>
        <span className="relative text-[10px] font-semibold text-muted-foreground bg-muted/60 border border-border/60 rounded-md px-1.5 py-0.5">
          ⌘K
        </span>
      </Link>

      {/* Combined CTA + stats split card */}
      <div className="rounded-3xl overflow-hidden border border-border/60 shadow-[0_10px_30px_-12px_hsl(var(--primary)/0.45)] grid grid-cols-5">
        <Link
          to="/shop"
          className="col-span-3 relative p-4 text-primary-foreground focus-ring pressable flex flex-col justify-between"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
          <div className="relative w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="relative mt-4">
            <p className="font-display font-bold text-[15px] leading-tight">Start learning today</p>
            <p className="text-[11px] opacity-80 mt-0.5 flex items-center gap-1">
              Pick a path in one tap <ChevronRight className="h-3 w-3" />
            </p>
          </div>
        </Link>
        <div className="col-span-2 bg-card flex flex-col divide-y divide-border/60">
          <div className="flex-1 flex items-center gap-2.5 px-3 py-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center text-white">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-sm text-foreground leading-tight">120+</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Lessons</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2.5 px-3 py-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-sm text-foreground leading-tight">24/7</p>
              <p className="text-[10px] text-muted-foreground leading-tight">AI Tutor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Essential quick actions */}
      <div className="grid grid-cols-4 gap-2">
        {pillActions.map((t) => (
          <PillTile key={t.label} {...t} />
        ))}
      </div>
    </section>
  );
}
