import { useId, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useHeaderMenuOpen } from "@/hooks/use-header-visibility";

import {
  GraduationCap,
  BookOpen,
  Sparkles,
  Flame,
  Bot,
  Users,
  MessageSquare,
  Video,
  Heart,
  Trophy,
  Compass,
  HelpCircle,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import {
  NavigationMenu as NM,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import courseAiMl from "@/assets/course-ai-ml.webp";
import coursePython from "@/assets/course-python.webp";
import promptLibrary from "@/assets/prompt-library.webp";

type Item = { icon: any; label: string; href: string; desc: string };
type QuickLink = { label: string; href: string };
type Panel = {
  label: string;
  icon: any;
  matchPaths: string[];
  items: Item[];
  quick: QuickLink[];
  feature: {
    eyebrow: string;
    title: string;
    desc: string;
    href: string;
    cta: string;
    image: string;
  };
  viewAllHref: string;
  viewAllLabel: string;
};

const PANELS: Panel[] = [
  {
    label: "Learn",
    icon: GraduationCap,
    matchPaths: ["/learn", "/shop"],
    items: [
      { icon: GraduationCap, label: "Courses", href: "/shop?type=courses", desc: "Expert-led AI & coding tracks" },
      { icon: Compass, label: "Tracks", href: "/learn", desc: "Guided learning journeys" },
      { icon: BookOpen, label: "Lessons", href: "/learn", desc: "Bite-sized modules" },
      { icon: Bot, label: "AI Tutor", href: "/learn", desc: "24/7 chat in Bangla & English" },
    ],
    quick: [
      { label: "Machine Learning 101", href: "/shop?type=courses" },
      { label: "Python for Beginners", href: "/shop?type=courses" },
      { label: "Prompt Engineering", href: "/prompts" },
      { label: "Free starter lessons", href: "/learn" },
    ],
    feature: {
      eyebrow: "New course",
      title: "Learn AI with Asikon",
      desc: "Master ML, Python, and modern AI tools.",
      href: "/shop?type=courses",
      cta: "Browse courses",
      image: courseAiMl,
    },
    viewAllHref: "/shop?type=courses",
    viewAllLabel: "View all courses",
  },
  {
    label: "Explore",
    icon: BookOpen,
    matchPaths: ["/shop", "/prompts"],
    items: [
      { icon: BookOpen, label: "Books", href: "/shop?type=ebooks", desc: "Curated reading list" },
      { icon: Sparkles, label: "Prompts", href: "/prompts", desc: "1000+ AI prompt library" },
      { icon: Flame, label: "Trending", href: "/shop?filter=trending", desc: "What learners love" },
      { icon: Heart, label: "Deals", href: "/shop?filter=deals", desc: "Limited time offers" },
    ],
    quick: [
      { label: "New arrivals", href: "/shop?filter=new" },
      { label: "Bestsellers", href: "/shop?filter=trending" },
      { label: "Student kits", href: "/shop?type=bundles" },
      { label: "Gift cards", href: "/shop" },
    ],
    feature: {
      eyebrow: "Limited deal",
      title: "Skill-Up Friday — 50% off",
      desc: "Top-rated courses on sale.",
      href: "/shop?filter=deals",
      cta: "View deals",
      image: promptLibrary,
    },
    viewAllHref: "/shop",
    viewAllLabel: "View all shop",
  },
  {
    label: "Community",
    icon: Users,
    matchPaths: ["/community", "/game"],
    items: [
      { icon: MessageSquare, label: "Feed", href: "/community", desc: "Latest from learners" },
      { icon: Video, label: "Live & shorts", href: "/community", desc: "Watch and learn" },
      { icon: Users, label: "Reviews", href: "/community", desc: "Verified buyer reviews" },
      { icon: Trophy, label: "Game & rewards", href: "/game", desc: "Earn coins, climb ranks" },
    ],
    quick: [
      { label: "My feed", href: "/community" },
      { label: "Top reviewers", href: "/community" },
      { label: "Leaderboard", href: "/game" },
      { label: "How rewards work", href: "/game" },
    ],
    feature: {
      eyebrow: "Join free",
      title: "Trusted by learners",
      desc: "Real reviews from verified buyers.",
      href: "/community",
      cta: "Explore community",
      image: coursePython,
    },
    viewAllHref: "/community",
    viewAllLabel: "Visit community",
  },
  {
    label: "Mentorship",
    icon: Heart,
    matchPaths: ["/mentors"],
    items: [
      { icon: Users, label: "Browse mentors", href: "/mentors", desc: "Personal tutors for children" },
      { icon: HelpCircle, label: "Join waitlist", href: "/mentors", desc: "Be first in line" },
      { icon: Compass, label: "About program", href: "/about", desc: "How 1-on-1 works" },
    ],
    quick: [
      { label: "For parents", href: "/mentors" },
      { label: "For mentors", href: "/mentors" },
      { label: "Pricing & plans", href: "/mentors" },
      { label: "FAQ", href: "/help" },
    ],
    feature: {
      eyebrow: "1-on-1",
      title: "Find your child's tutor",
      desc: "Hand-picked educators, waitlist-only.",
      href: "/mentors",
      cta: "Request a mentor",
      image: courseAiMl,
    },
    viewAllHref: "/mentors",
    viewAllLabel: "View mentorship",
  },
];

function PanelGrid({ panel }: { panel: Panel }) {
  return (
    <div className="w-[780px] p-5">
      <div className="grid grid-cols-[1fr_1fr_260px] gap-5">
        {/* Primary links */}
        <div>
          <p className="px-2 mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            Explore
          </p>
          <ul className="space-y-1">
            {panel.items.map((it) => {
              const Icon = it.icon;
              return (
                <li key={it.label}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={it.href}
                      className="group flex gap-3 rounded-xl p-2.5 hover:bg-secondary/60 focus-ring-popover transition-all hover:translate-x-0.5"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary/15 group-hover:shadow-[var(--shadow-glow)] transition-all">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium leading-tight">
                          {it.label}
                        </span>
                        <span className="block text-[11px] text-muted-foreground truncate">
                          {it.desc}
                        </span>
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <p className="px-2 mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            Popular
          </p>
          <ul className="space-y-0.5">
            {panel.quick.map((q) => (
              <li key={q.label}>
                <NavigationMenuLink asChild>
                  <Link
                    to={q.href}
                    className="group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 focus-ring-popover transition-colors"
                  >
                    <span className="truncate">{q.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Feature card */}
        <Link
          to={panel.feature.href}
          className="group relative overflow-hidden rounded-xl border border-primary/20 flex flex-col focus-ring-popover shadow-md"
          style={{ background: "var(--gradient-primary-soft)" }}
        >
          <div className="relative h-24 overflow-hidden">
            <img
              src={panel.feature.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, hsl(var(--card) / 0.85) 100%)",
              }}
            />
          </div>
          <div className="p-3 -mt-2 relative">
            <p className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">
              {panel.feature.eyebrow}
            </p>
            <p className="mt-1 text-sm font-display font-semibold leading-snug">
              {panel.feature.title}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {panel.feature.desc}
            </p>
            <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-primary">
              {panel.feature.cta}
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </Link>
      </div>

      {/* Footer strip */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          Trusted by 10,000+ learners across Bangladesh.
        </p>
        <NavigationMenuLink asChild>
          <Link
            to={panel.viewAllHref}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-1.5 transition-all focus-ring-popover rounded"
          >
            {panel.viewAllLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </NavigationMenuLink>
      </div>
    </div>
  );
}

export function MegaMenu({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const { setOpen } = useHeaderMenuOpen();
  const id = useId();
  const [value, setValue] = useState("");

  useEffect(() => {
    setOpen(id, value !== "");
    return () => setOpen(id, false);
  }, [id, value, setOpen]);

  const isActive = (paths: string[]) =>
    paths.some((p) => pathname === p || pathname.startsWith(p + "/"));

  return (
    <NM value={value} onValueChange={setValue} className={cn("hidden md:flex", className)}>
      <NavigationMenuList className="gap-0.5">

        {PANELS.map((p) => {
          const Icon = p.icon;
          const active = isActive(p.matchPaths);
          return (
            <NavigationMenuItem key={p.label}>
              <NavigationMenuTrigger
                className={cn(
                  "group/trg relative bg-transparent rounded-full px-3 h-8 text-[13px] font-medium leading-none",
                  "data-[state=open]:bg-primary data-[state=open]:text-primary-foreground data-[state=open]:shadow-[0_6px_20px_-8px_hsl(var(--primary)/0.55)]",
                  "hover:bg-primary/10 hover:text-primary",
                  "transition-colors",
                  active && "text-primary"
                )}
              >
                <Icon className="h-3.5 w-3.5 mr-1 opacity-80" />
                {p.label}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <PanelGrid panel={p} />
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/about"
              className={cn(
                "inline-flex items-center gap-1 px-3 h-8 text-[13px] font-medium leading-none rounded-full transition-colors hover:bg-primary/10 hover:text-primary",
                pathname === "/about" && "text-primary"
              )}
            >
              <Compass className="h-3.5 w-3.5 opacity-80" />
              About
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NM>
  );
}

// ─────────────────────────────────────────────────────────────
// Compact fallback navigation for narrow desktop widths (<md)
// ─────────────────────────────────────────────────────────────
import { Menu as MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BrowseMenu({ className }: { className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "md:hidden inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-medium",
          "bg-secondary/60 hover:bg-secondary text-foreground transition-colors",
          "ring-1 ring-border/60",
          className
        )}
        aria-label="Browse navigation"
      >
        <MenuIcon className="h-4 w-4 opacity-80" />
        Browse
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="w-64 rounded-2xl p-2 bg-popover/95 backdrop-blur-2xl"
      >
        {PANELS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={p.label}>
              {idx > 0 && <DropdownMenuSeparator className="my-1" />}
              <DropdownMenuLabel className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                <Icon className="h-3.5 w-3.5 opacity-80" />
                {p.label}
              </DropdownMenuLabel>
              {p.items.slice(0, 4).map((it) => {
                const ItIcon = it.icon;
                return (
                  <DropdownMenuItem key={it.href} asChild className="rounded-lg cursor-pointer">
                    <Link to={it.href} className="flex items-center gap-2.5">
                      <ItIcon className="h-4 w-4 opacity-70" />
                      <span className="text-sm">{it.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </div>
          );
        })}
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
          <Link to="/about" className="flex items-center gap-2.5">
            <Compass className="h-4 w-4 opacity-70" />
            <span className="text-sm">About</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
