import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import {
  Brain, Code2, Palette, Wallet, Briefcase, Smartphone, Gamepad2, BookOpen,
  Wand2, GraduationCap, MessagesSquare, Compass,
} from "lucide-react";
import { Reveal } from "@/components/transitions/Reveal";
import { cn } from "@/lib/utils";

type Cat = { icon: any; label: string; href: string };

const CATS: Cat[] = [
  { icon: Brain,          label: "AI & ML",     href: "/shop?category=ai" },
  { icon: Code2,          label: "Development", href: "/shop?category=dev" },
  { icon: Palette,        label: "Design",      href: "/shop?category=design" },
  { icon: Wallet,         label: "Finance",     href: "/shop?category=finance" },
  { icon: Briefcase,      label: "Business",    href: "/shop?category=business" },
  { icon: Smartphone,     label: "Apps",        href: "/shop?category=apps" },
  { icon: Gamepad2,       label: "Games",       href: "/shop?category=games" },
  { icon: BookOpen,       label: "Books",       href: "/shop?type=ebooks" },
  { icon: Wand2,          label: "Prompts",     href: "/prompts" },
  { icon: GraduationCap,  label: "Mentors",     href: "/mentors" },
  { icon: MessagesSquare, label: "Community",   href: "/community" },
  { icon: Compass,        label: "Tracks",      href: "/shop?type=courses" },
];

export function CategoriesScroll() {
  const [emblaRef] = useEmblaCarousel({ align: "start", dragFree: true, containScroll: "trimSnaps" });

  const pairs: Cat[][] = [];
  for (let i = 0; i < CATS.length; i += 2) pairs.push(CATS.slice(i, i + 2));

  return (
    <Reveal as="section" className="section-x">
      <div className="flex items-end justify-between mb-2">
        <h2 className="font-semibold text-base">Categories</h2>
        <Link to="/shop" className="text-xs text-primary font-medium">See all</Link>
      </div>

      {/* Mobile: 2-row scroll, brand-gradient chips */}
      <div className="md:hidden -mx-3 px-3 overflow-hidden" ref={emblaRef}>
        <div className="flex gap-2.5">
          {pairs.map((pair, i) => (
            <div key={i} className="shrink-0 flex flex-col gap-2.5 w-[78px]">
              {pair.map((c) => <CatTile key={c.label} {...c} />)}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-6 lg:grid-cols-12 gap-3">
        {CATS.map((c) => <CatTile key={c.label} {...c} />)}
      </div>
    </Reveal>
  );
}

function CatTile({ icon: Icon, label, href }: Cat) {
  return (
    <Link
      to={href}
      className="group focus-ring flex flex-col items-center gap-1.5 rounded-2xl py-1.5 px-1 active:scale-[0.94] hover:-translate-y-0.5 transition-transform"
    >
      <div
        className={cn(
          "relative w-[52px] h-[52px] rounded-[16px] overflow-hidden",
          "bg-white/[0.04] backdrop-blur-xl border border-white/10",
          "flex items-center justify-center",
          "shadow-[0_8px_24px_-12px_hsl(var(--primary)/0.55),inset_0_1px_0_hsl(var(--glass-highlight)/0.18)]",
          "group-hover:bg-white/[0.08] transition-all duration-300",
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(120% 80% at 30% 20%, hsl(var(--primary) / 0.28) 0%, transparent 60%)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-2 top-1 h-1/3 rounded-full bg-gradient-to-b from-white/25 to-transparent blur-[2px]"
        />
        <Icon className="relative h-[20px] w-[20px] text-primary drop-shadow-[0_1px_3px_hsl(var(--primary)/0.55)]" strokeWidth={2} />
      </div>
      <span className="text-[11px] font-medium leading-tight text-center truncate w-full text-foreground/85">
        {label}
      </span>
    </Link>
  );
}
