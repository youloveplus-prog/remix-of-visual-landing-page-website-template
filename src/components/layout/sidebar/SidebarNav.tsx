import {
  Library,
  GraduationCap,
  Package,
  Heart,
  Bell,
  Trophy,
  Compass,
  Wand2,
  ChevronDown,
  Brain,
  Laptop,
  Bot,
  BookOpen,
  HelpCircle,
  Mail,
  Info,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

interface SidebarNavProps {
  onClose?: () => void;
}

/* Facebook-style colored shortcut tile */
function ShortcutTile({
  to,
  icon,
  label,
  tint,
  badge,
  onClose,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  tint: string; // tailwind bg + text classes for the icon chip
  badge?: number;
  onClose?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className="group relative flex items-center gap-2.5 h-[60px] px-2.5 rounded-[16px] bg-card border border-black/5 hover:border-primary/20 hover:bg-foreground/[0.02] active:scale-[0.98] transition-all shadow-sm"
    >
      <span
        className={cn(
          "relative flex items-center justify-center w-10 h-10 rounded-[12px] flex-shrink-0",
          tint,
        )}
      >
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-card tabular-nums">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </span>
      <span className="text-[12.5px] font-semibold text-foreground leading-tight truncate">
        {label}
      </span>
    </Link>
  );
}

/* Compact list row for secondary sections */
function ListRow({
  to,
  icon,
  label,
  isActive,
  onClose,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClose?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 h-11 px-3 rounded-[12px] transition-colors active:scale-[0.99]",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/75 hover:bg-foreground/[0.04] hover:text-foreground",
      )}
    >
      <span className={cn("flex-shrink-0", isActive ? "text-primary" : "text-foreground/55")}>
        {icon}
      </span>
      <span className={cn("text-[14px] truncate", isActive ? "font-semibold" : "font-medium")}>
        {label}
      </span>
    </Link>
  );
}

function SectionTrigger({
  label,
  open,
}: {
  label: string;
  open: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-3 pt-5 pb-2">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
        {label}
      </span>
      <ChevronDown
        className={cn(
          "w-4 h-4 text-muted-foreground/60 transition-transform",
          open && "rotate-180",
        )}
      />
    </div>
  );
}

export function SidebarNav({ onClose }: SidebarNavProps) {
  const { pathname, search } = useLocation();
  const here = pathname + search;
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const cartCount = cart?.length ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  // Items the bottom nav already covers (Home, Shop, Learn, Community, Profile)
  // are intentionally omitted here — Facebook-style: shortcuts to everything else.
  const shortcuts = [
    { to: "/library", icon: <Library className="w-5 h-5" />, label: "Library", tint: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300" },
    { to: "/mentors", icon: <GraduationCap className="w-5 h-5" />, label: "Mentors", tint: "bg-amber-500/15 text-amber-600 dark:text-amber-300" },
    { to: "/orders", icon: <Package className="w-5 h-5" />, label: "Orders", tint: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" },
    { to: "/wishlist", icon: <Heart className="w-5 h-5" />, label: "Wishlist", tint: "bg-rose-500/15 text-rose-600 dark:text-rose-300", badge: wishlistCount },
    { to: "/notifications", icon: <Bell className="w-5 h-5" />, label: "Alerts", tint: "bg-sky-500/15 text-sky-600 dark:text-sky-300" },
    { to: "/leaderboard", icon: <Trophy className="w-5 h-5" />, label: "Leaderboard", tint: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-300" },
  ];

  const discover = [
    { to: "/resources", icon: <Compass className="w-[18px] h-[18px]" />, label: "Resources" },
    { to: "/prompts", icon: <Wand2 className="w-[18px] h-[18px]" />, label: "Prompt Library" },
    { to: "/shop?category=ai-ml", icon: <Brain className="w-[18px] h-[18px]" />, label: "AI & ML" },
    { to: "/shop?category=programming", icon: <Laptop className="w-[18px] h-[18px]" />, label: "Programming" },
    { to: "/shop?category=ai-tutor", icon: <Bot className="w-[18px] h-[18px]" />, label: "AI Tutor Picks" },
    { to: "/shop?category=self-improvement", icon: <BookOpen className="w-[18px] h-[18px]" />, label: "Self-Improvement" },
  ];

  const help = [
    { to: "/help", icon: <HelpCircle className="w-[18px] h-[18px]" />, label: "Help & FAQ" },
    { to: "/contact", icon: <Mail className="w-[18px] h-[18px]" />, label: "Contact" },
    { to: "/about", icon: <Info className="w-[18px] h-[18px]" />, label: "About ASIKON" },
    { to: "/terms", icon: <FileText className="w-[18px] h-[18px]" />, label: "Terms" },
    { to: "/privacy", icon: <ShieldCheck className="w-[18px] h-[18px]" />, label: "Privacy" },
  ];

  const isActive = (href: string) => {
    if (href.includes("?")) return here === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="px-4 pt-1 pb-2">
      {/* Shortcuts header */}
      <div className="flex items-center justify-between px-1 pt-1 pb-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
          Your shortcuts
        </span>
      </div>

      {/* 2-col tile grid — Facebook menu style */}
      <div className="grid grid-cols-2 gap-2">
        {shortcuts.map((s) => (
          <ShortcutTile
            key={s.to}
            to={s.to}
            icon={s.icon}
            label={s.label}
            tint={s.tint}
            badge={s.badge}
            onClose={onClose}
          />
        ))}
      </div>

      {/* Discover (collapsible) */}
      <Collapsible open={discoverOpen} onOpenChange={setDiscoverOpen}>
        <CollapsibleTrigger className="w-full">
          <SectionTrigger label="Discover" open={discoverOpen} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-0.5 -mx-1">
          {discover.map((i) => (
            <ListRow key={i.to} {...i} isActive={isActive(i.to)} onClose={onClose} />
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Help & Support (collapsible) */}
      <Collapsible open={helpOpen} onOpenChange={setHelpOpen}>
        <CollapsibleTrigger className="w-full">
          <SectionTrigger label="Help & Support" open={helpOpen} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-0.5 -mx-1">
          {help.map((i) => (
            <ListRow key={i.to} {...i} isActive={isActive(i.to)} onClose={onClose} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </nav>
  );
}
