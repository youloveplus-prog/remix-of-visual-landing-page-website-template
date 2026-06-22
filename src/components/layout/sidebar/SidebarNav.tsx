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
  Settings,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";

interface SidebarNavProps {
  onClose?: () => void;
}

/* ---------- Facebook-style horizontal shortcut tile (large square + label below) ---------- */
function ShortcutCard({
  to,
  icon,
  label,
  tint,
  badge,
  isActive,
  onClose,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  tint: string;
  badge?: number;
  isActive?: boolean;
  onClose?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      aria-current={isActive ? "page" : undefined}
      className="relative flex flex-col items-center gap-1.5 w-[80px] flex-shrink-0 active:scale-[0.97] transition-transform"
    >
      <span
        className={cn(
          "relative w-[72px] h-[72px] rounded-[18px] flex items-center justify-center shadow-sm overflow-hidden transition-all",
          tint,
          isActive
            ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-md scale-[1.02]"
            : "ring-1 ring-black/5",
        )}
      >
        {icon}
        {badge !== undefined && badge > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-background tabular-nums">
            {badge > 9 ? "9+" : badge}
          </span>
        )}
        {isActive && (
          <span
            aria-hidden
            className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-primary ring-2 ring-background flex items-center justify-center"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
          </span>
        )}
      </span>
      <span
        className={cn(
          "text-[12px] leading-tight text-center truncate w-full px-0.5 transition-colors",
          isActive ? "font-bold text-primary" : "font-semibold text-foreground/85",
        )}
      >
        {label}
      </span>
      {isActive && (
        <span
          aria-hidden
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
        />
      )}
    </Link>
  );
}

/* ---------- Facebook-style single-line list row (outline icon + label) ---------- */
function ListRow({
  to,
  icon,
  label,
  isActive,
  rightBadge,
  onClose,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  rightBadge?: string;
  onClose?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-center gap-4 h-12 px-2 rounded-[12px] active:scale-[0.99] transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-foreground/85 hover:bg-foreground/[0.04]",
      )}
    >
      {isActive && (
        <span
          aria-hidden
          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
        />
      )}
      <span
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-full border flex-shrink-0",
          isActive
            ? "border-primary/40 text-primary bg-primary/5"
            : "border-foreground/15 text-foreground/80",
        )}
      >
        {icon}
      </span>
      <span className={cn("flex-1 text-[15px] truncate", isActive ? "font-bold" : "font-semibold")}>
        {label}
      </span>
      {rightBadge && (
        <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
          {rightBadge}
        </span>
      )}
    </Link>
  );
}

/* ---------- Collapsible section header (FB style: icon + title + chevron) ---------- */
function CollapsibleSection({
  icon,
  label,
  open,
  onOpenChange,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="w-full group">
        <div className="flex items-center gap-4 h-12 px-2 rounded-[12px] hover:bg-foreground/[0.04] transition-colors">
          <span className="flex items-center justify-center w-9 h-9 rounded-full border border-foreground/15 text-foreground/80 flex-shrink-0">
            {icon}
          </span>
          <span className="flex-1 text-left text-[15px] font-semibold text-foreground/85">
            {label}
          </span>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-foreground/55 transition-transform",
              open && "rotate-180",
            )}
          />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-12 pr-1 py-1 space-y-0.5">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function SubRow({
  to,
  label,
  isActive,
  onClose,
}: {
  to: string;
  label: string;
  isActive?: boolean;
  onClose?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClose}
      className={cn(
        "block h-10 px-3 rounded-[10px] text-[14px] leading-[2.5rem] truncate transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

export function SidebarNav({ onClose }: SidebarNavProps) {
  const { pathname, search } = useLocation();
  const here = pathname + search;
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const { data: wishlist } = useWishlist();
  const wishlistCount = wishlist?.length ?? 0;

  const isActive = (href: string) => {
    if (href.includes("?")) return here === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Horizontal "Your shortcuts" — top, most-tapped destinations
  const shortcuts = [
    { to: "/library", icon: <Library className="w-7 h-7" />, label: "Library", tint: "bg-gradient-to-br from-indigo-500/90 to-blue-600/90 text-white" },
    { to: "/mentors", icon: <GraduationCap className="w-7 h-7" />, label: "Mentors", tint: "bg-gradient-to-br from-amber-500/90 to-orange-500/90 text-white" },
    { to: "/leaderboard", icon: <Trophy className="w-7 h-7" />, label: "Leaderboard", tint: "bg-gradient-to-br from-yellow-400/90 to-amber-500/90 text-white" },
    { to: "/resources", icon: <Compass className="w-7 h-7" />, label: "Resources", tint: "bg-gradient-to-br from-emerald-500/90 to-teal-600/90 text-white" },
    { to: "/prompts", icon: <Wand2 className="w-7 h-7" />, label: "Prompts", tint: "bg-gradient-to-br from-violet-500/90 to-fuchsia-600/90 text-white" },
    { to: "/ai-tutor", icon: <Bot className="w-7 h-7" />, label: "AI Tutor", tint: "bg-gradient-to-br from-sky-500/90 to-cyan-600/90 text-white" },
  ];

  // Primary list (always visible)
  const primaryList = [
    { to: "/orders", icon: <Package className="w-[18px] h-[18px]" />, label: "Orders" },
    { to: "/wishlist", icon: <Heart className="w-[18px] h-[18px]" />, label: "Wishlist", rightBadge: wishlistCount > 0 ? (wishlistCount > 9 ? "9+" : String(wishlistCount)) : undefined },
    { to: "/notifications", icon: <Bell className="w-[18px] h-[18px]" />, label: "Notifications" },
    { to: "/community", icon: <Sparkles className="w-[18px] h-[18px]" />, label: "Community" },
  ];

  // Revealed after "See more"
  const moreList = [
    { to: "/shop?category=ai-ml", icon: <Brain className="w-[18px] h-[18px]" />, label: "AI & ML" },
    { to: "/shop?category=programming", icon: <Laptop className="w-[18px] h-[18px]" />, label: "Programming" },
    { to: "/shop?category=ai-tutor", icon: <Bot className="w-[18px] h-[18px]" />, label: "AI Tutor Picks" },
    { to: "/shop?category=self-improvement", icon: <BookOpen className="w-[18px] h-[18px]" />, label: "Self-Improvement" },
  ];

  return (
    <nav className="px-3 pt-2 pb-2">
      {/* ---------- Your shortcuts ---------- */}
      <div className="px-2 pt-1 pb-2">
        <span className="text-[15px] font-bold text-foreground">Your shortcuts</span>
      </div>
      <div className="-mx-3 px-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-2 pr-2">
          {shortcuts.map((s) => (
            <ShortcutCard
              key={s.to}
              to={s.to}
              icon={s.icon}
              label={s.label}
              tint={s.tint}
              isActive={isActive(s.to)}
              onClose={onClose}
            />
          ))}
        </div>
      </div>

      <div className="h-px bg-border/60 my-2 mx-1" />

      {/* ---------- Primary list ---------- */}
      <div className="space-y-0.5">
        {primaryList.map((i) => (
          <ListRow
            key={i.to}
            to={i.to}
            icon={i.icon}
            label={i.label}
            rightBadge={i.rightBadge}
            isActive={isActive(i.to)}
            onClose={onClose}
          />
        ))}

        {showMore &&
          moreList.map((i) => (
            <ListRow
              key={i.to}
              to={i.to}
              icon={i.icon}
              label={i.label}
              isActive={isActive(i.to)}
              onClose={onClose}
            />
          ))}
      </div>

      {/* See more / See less */}
      <button
        type="button"
        onClick={() => setShowMore((v) => !v)}
        className="mt-2 w-full h-11 rounded-[12px] bg-foreground/[0.05] hover:bg-foreground/[0.08] text-[14px] font-semibold text-foreground/85 transition-colors"
      >
        {showMore ? "See less" : "See more"}
      </button>

      <div className="h-px bg-border/60 my-3 mx-1" />

      {/* ---------- Collapsible sections (FB-style) ---------- */}
      <div className="space-y-0.5">
        <CollapsibleSection
          icon={<Compass className="w-[18px] h-[18px]" />}
          label="Discover"
          open={discoverOpen}
          onOpenChange={setDiscoverOpen}
        >
          <SubRow to="/resources" label="Resources" isActive={isActive("/resources")} onClose={onClose} />
          <SubRow to="/prompts" label="Prompt Library" isActive={isActive("/prompts")} onClose={onClose} />
          <SubRow to="/shop?category=ai-ml" label="AI & ML" isActive={isActive("/shop?category=ai-ml")} onClose={onClose} />
          <SubRow to="/shop?category=programming" label="Programming" isActive={isActive("/shop?category=programming")} onClose={onClose} />
          <SubRow to="/shop?category=self-improvement" label="Self-Improvement" isActive={isActive("/shop?category=self-improvement")} onClose={onClose} />
        </CollapsibleSection>

        <CollapsibleSection
          icon={<HelpCircle className="w-[18px] h-[18px]" />}
          label="Help & support"
          open={helpOpen}
          onOpenChange={setHelpOpen}
        >
          <SubRow to="/help" label="Help & FAQ" isActive={isActive("/help")} onClose={onClose} />
          <SubRow to="/contact" label="Contact us" isActive={isActive("/contact")} onClose={onClose} />
          <SubRow to="/about" label="About ASIKON" isActive={isActive("/about")} onClose={onClose} />
        </CollapsibleSection>

        <CollapsibleSection
          icon={<Settings className="w-[18px] h-[18px]" />}
          label="Settings & privacy"
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
        >
          <SubRow to="/settings" label="Settings" isActive={isActive("/settings")} onClose={onClose} />
          <SubRow to="/terms" label="Terms of Service" isActive={isActive("/terms")} onClose={onClose} />
          <SubRow to="/privacy" label="Privacy policy" isActive={isActive("/privacy")} onClose={onClose} />
        </CollapsibleSection>

        <ListRow
          to="/about"
          icon={<LayoutGrid className="w-[18px] h-[18px]" />}
          label="Also from ASIKON"
          isActive={false}
          onClose={onClose}
        />
      </div>
    </nav>
  );
}
