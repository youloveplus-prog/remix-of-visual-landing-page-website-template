import {
  Home,
  Compass,
  Sparkles,
  Users,
  ShoppingBag,
  Library,
  GraduationCap,
  Wand2,
  Trophy,
  Bell,
  Heart,
  Package,
  ChevronDown,
  BookOpen,
  Brain,
  Laptop,
  Bot,
  Info,
  HelpCircle,
  Mail,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
  isActive?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, href, badge, isActive, onClick }: NavItemProps) {
  return (
    <Link
      to={href}
      onClick={onClick}
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
      {badge && (
        <span className="ml-auto bg-primary/15 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wide">
          {badge}
        </span>
      )}
    </Link>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pt-4 pb-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
        {children}
      </span>
    </div>
  );
}

interface SidebarNavProps {
  onClose?: () => void;
}

export function SidebarNav({ onClose }: SidebarNavProps) {
  const { pathname, search } = useLocation();
  const here = pathname + search;
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const primary: NavItemProps[] = [
    { icon: <Home className="w-[18px] h-[18px]" />, label: "Home", href: "/" },
    { icon: <ShoppingBag className="w-[18px] h-[18px]" />, label: "Shop", href: "/shop" },
    { icon: <Sparkles className="w-[18px] h-[18px]" />, label: "AI Tutor", href: "/learn", badge: "BETA" },
    { icon: <Users className="w-[18px] h-[18px]" />, label: "Community", href: "/community" },
    { icon: <Library className="w-[18px] h-[18px]" />, label: "Library", href: "/library" },
    { icon: <GraduationCap className="w-[18px] h-[18px]" />, label: "Mentors", href: "/mentors" },
  ];

  const account: NavItemProps[] = [
    { icon: <Package className="w-[18px] h-[18px]" />, label: "Orders", href: "/orders" },
    { icon: <Heart className="w-[18px] h-[18px]" />, label: "Wishlist", href: "/wishlist" },
    { icon: <Bell className="w-[18px] h-[18px]" />, label: "Notifications", href: "/notifications" },
  ];

  const discover: NavItemProps[] = [
    { icon: <Compass className="w-[18px] h-[18px]" />, label: "Resources", href: "/resources" },
    { icon: <Wand2 className="w-[18px] h-[18px]" />, label: "Prompt Library", href: "/prompts" },
    { icon: <Trophy className="w-[18px] h-[18px]" />, label: "Leaderboard", href: "/leaderboard" },
    { icon: <Brain className="w-[18px] h-[18px]" />, label: "AI & ML", href: "/shop?category=ai-ml" },
    { icon: <Laptop className="w-[18px] h-[18px]" />, label: "Programming", href: "/shop?category=programming" },
    { icon: <Bot className="w-[18px] h-[18px]" />, label: "AI Tutor Picks", href: "/shop?category=ai-tutor" },
    { icon: <BookOpen className="w-[18px] h-[18px]" />, label: "Self-Improvement", href: "/shop?category=self-improvement" },
  ];

  const more: NavItemProps[] = [
    { icon: <HelpCircle className="w-[18px] h-[18px]" />, label: "Help & FAQ", href: "/help" },
    { icon: <Mail className="w-[18px] h-[18px]" />, label: "Contact", href: "/contact" },
    { icon: <Info className="w-[18px] h-[18px]" />, label: "About ASIKON", href: "/about" },
    { icon: <FileText className="w-[18px] h-[18px]" />, label: "Terms", href: "/terms" },
    { icon: <ShieldCheck className="w-[18px] h-[18px]" />, label: "Privacy", href: "/privacy" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("?")) return here === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="px-3 pt-1 pb-2">
      {/* Primary — no label, highest priority */}
      <div className="space-y-0.5">
        {primary.map((item) => (
          <NavItem key={item.href} {...item} isActive={isActive(item.href)} onClick={onClose} />
        ))}
      </div>

      {/* Account */}
      <GroupLabel>Account</GroupLabel>
      <div className="space-y-0.5">
        {account.map((item) => (
          <NavItem key={item.href} {...item} isActive={isActive(item.href)} onClick={onClose} />
        ))}
      </div>

      {/* Discover (collapsible) */}
      <Collapsible open={discoverOpen} onOpenChange={setDiscoverOpen}>
        <CollapsibleTrigger className="w-full group">
          <div className="flex items-center justify-between px-3 pt-4 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
              Discover
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-muted-foreground/60 transition-transform",
                discoverOpen && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-0.5">
          {discover.map((item) => (
            <NavItem key={item.href} {...item} isActive={isActive(item.href)} onClick={onClose} />
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* More (collapsible) */}
      <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
        <CollapsibleTrigger className="w-full group">
          <div className="flex items-center justify-between px-3 pt-4 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/80">
              More
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 text-muted-foreground/60 transition-transform",
                moreOpen && "rotate-180",
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-0.5">
          {more.map((item) => (
            <NavItem key={item.href} {...item} isActive={isActive(item.href)} onClick={onClose} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </nav>
  );
}
