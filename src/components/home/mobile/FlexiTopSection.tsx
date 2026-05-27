import { Link } from "react-router-dom";
import {
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
};

const pillActions: Tile[] = [
  { icon: ShoppingBag, label: "Shop", href: "/shop" },
  { icon: GraduationCap, label: "Courses", href: "/shop?type=courses" },
  { icon: Sparkles, label: "AI tuor", href: "/ai-tutor" },
  { icon: Tag, label: "Deals", href: "/shop?filter=deals" },
];

function PillTile({ icon: Icon, label, href }: Tile) {
  return (
    <Link
      to={href}
      className="flex flex-col items-center gap-2 focus-ring rounded-2xl pressable group"
    >
      <div className="midnight-tile w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-primary/15 to-primary/5 border-primary/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_14px_30px_-12px_hsl(var(--primary)/0.55)]">
        <Icon
          className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110"
          strokeWidth={2.2}
        />
      </div>
      <span className="text-[11px] font-semibold text-foreground/85">{label}</span>
    </Link>
  );
}

export function FlexiTopSection() {
  return (
    <section className="section-x space-y-3 pt-2 animate-fade-in">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
            Welcome to ASIKON
          </p>
          <h1 className="font-display font-bold text-foreground text-[17px] leading-tight mt-0.5">
            Learn smarter, every day.
          </h1>
        </div>
        <Link
          to="/shop?type=courses"
          className="text-[11px] font-semibold text-primary hover:text-primary/80 shrink-0"
        >
          Browse courses →
        </Link>
      </div>

      {/* Combined CTA + stats split card */}
      <div className="rounded-3xl overflow-hidden border border-border/60 shadow-[0_18px_40px_-18px_hsl(var(--primary)/0.55)] grid grid-cols-5 midnight-shine">
        <Link
          to="/shop"
          className="col-span-3 relative p-4 text-primary-foreground focus-ring pressable flex flex-col justify-between transition-transform duration-300 active:scale-[0.98] overflow-hidden"
          style={{ background: "var(--gradient-primary)" }}
        >
          <div
            aria-hidden
            className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-white/15 blur-3xl"
          />
          <div className="relative w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
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
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-sm text-foreground leading-tight">120+</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Lessons</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-2.5 px-3 py-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-sm text-foreground leading-tight">24/7</p>
              <p className="text-[10px] text-muted-foreground leading-tight">AI tuor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Essential quick actions */}
      <div className="grid grid-cols-4 gap-3">
        {pillActions.map((t, i) => (
          <div
            key={t.label}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
          >
            <PillTile {...t} />
          </div>
        ))}
      </div>
    </section>
  );
}
