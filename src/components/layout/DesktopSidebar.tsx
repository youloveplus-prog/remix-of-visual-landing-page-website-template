import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  Home,
  Library,
  Users,
  Gamepad2,
  User,
  Heart,
  ShoppingCart,
  Package,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Wand2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  /** True when only icons are visible (collapsed AND not hovered open) */
  iconOnly: boolean;
  /** True when collapsed (used to enable tooltips even while hover-expanded settles) */
  isCollapsed: boolean;
  badge?: string;
  innerRef?: React.Ref<HTMLAnchorElement>;
}

function NavItem({ icon: Icon, label, href, isActive, iconOnly, isCollapsed, badge, innerRef }: NavItemProps) {
  const content = (
    <Link
      ref={innerRef}
      to={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group/navitem relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
        "hover:translate-x-[1px]",
        isActive
          ? "text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
        iconOnly && "justify-center px-2 hover:translate-x-0"
      )}
      style={
        isActive
          ? { background: "var(--gradient-primary-soft)" }
          : undefined
      }
    >
      {/* Active accent bar */}
      <span
        className={cn(
          "absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r-full transition-opacity",
          isActive ? "opacity-100" : "opacity-0"
        )}
        style={{ background: "var(--gradient-primary)" }}
        aria-hidden
      />
      <span
        className={cn(
          "grid place-items-center h-8 w-8 rounded-lg shrink-0 transition-all duration-200",
          isActive
            ? "bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]"
            : "text-current group-hover/navitem:bg-secondary/60"
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      {!iconOnly && (
        <>
          <span className="flex-1 truncate text-[13px] tracking-[-0.005em]">{label}</span>
          {badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  );

  if (iconOnly && isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {label}
          {badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
              {badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

interface DesktopSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function DesktopSidebar({ 
  className, 
  isCollapsed: controlledIsCollapsed,
  onCollapsedChange 
}: DesktopSidebarProps) {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const location = useLocation();
  const isCollapsed = controlledIsCollapsed ?? internalIsCollapsed;
  const setIsCollapsed = onCollapsedChange ?? setInternalIsCollapsed;

  const mainNavItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Library, label: "Library", href: "/shop" },
    { icon: Users, label: "Community", href: "/community" },
    { icon: Gamepad2, label: "Game & Rewards", href: "/game" },
  ];

  const shopNavItems = [
    { icon: GraduationCap, label: "Courses", href: "/shop?type=courses" },
    { icon: BookOpen, label: "Books", href: "/shop?type=books" },
    { icon: Package, label: "Student Kits", href: "/shop?type=kits" },
    { icon: Wand2, label: "Prompt Library", href: "/prompts" },
    { icon: Sparkles, label: "New Arrivals", href: "/shop?filter=new" },
  ];

  const userNavItems = [
    { icon: User, label: "My Profile", href: "/profile" },
    { icon: ShoppingCart, label: "Cart", href: "/cart", badge: "2" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Package, label: "Orders", href: "/orders" },
  ];

  const bottomNavItems = [
    { icon: Sparkles, label: "About ASIKON", href: "/about" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
  ];

  // Hover-to-expand when collapsed (visual only — main content padding stays at w-16)
  const [isHoverExpanded, setIsHoverExpanded] = useState(false);
  const expanded = !isCollapsed || isHoverExpanded;
  const iconOnly = isCollapsed && !isHoverExpanded;

  // Collapsible group state, persisted per-group
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return { menu: true, library: true, account: true };
    try {
      const stored = window.localStorage.getItem("sidebar:groups");
      if (stored) return { menu: true, library: true, account: true, ...JSON.parse(stored) };
    } catch {}
    return { menu: true, library: true, account: true };
  });
  useEffect(() => {
    window.localStorage.setItem("sidebar:groups", JSON.stringify(openGroups));
  }, [openGroups]);
  const toggleGroup = (key: string) =>
    setOpenGroups((g) => ({ ...g, [key]: !g[key] }));

  // Auto-open the group that contains the active route
  useEffect(() => {
    const path = location.pathname + location.search;
    if (mainNavItems.some((i) => i.href === location.pathname))
      setOpenGroups((g) => ({ ...g, menu: true }));
    if (shopNavItems.some((i) => i.href === path))
      setOpenGroups((g) => ({ ...g, library: true }));
    if (userNavItems.some((i) => i.href === location.pathname))
      setOpenGroups((g) => ({ ...g, account: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  // Scroll the active nav item into view on route change
  const activeRef = useRef<HTMLAnchorElement | null>(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [location.pathname, location.search]);

  const renderItem = (item: { icon: React.ElementType; label: string; href: string; badge?: string }, active: boolean) => (
    <NavItem
      key={item.href}
      {...item}
      isActive={active}
      iconOnly={iconOnly}
      isCollapsed={isCollapsed}
      innerRef={active ? activeRef : undefined}
    />
  );

  const GroupHeader = ({ id, label }: { id: string; label: string }) => (
    <button
      type="button"
      onClick={() => toggleGroup(id)}
      className="group/grp w-full flex items-center justify-between px-3 mb-2 text-[10px] font-semibold text-muted-foreground/80 uppercase tracking-[0.18em] hover:text-foreground transition-colors"
      aria-expanded={openGroups[id]}
    >
      <span>{label}</span>
      <ChevronDown
        className={cn(
          "h-3 w-3 transition-transform duration-200",
          openGroups[id] ? "rotate-0" : "-rotate-90"
        )}
      />
    </button>
  );


  return (
    <aside
      onMouseEnter={() => isCollapsed && setIsHoverExpanded(true)}
      onMouseLeave={() => setIsHoverExpanded(false)}
      className={cn(
        "fixed left-0 top-0 bottom-0 z-30 hidden lg:flex flex-col border-r border-border/40 liquid-nav transition-[width,box-shadow] duration-300 ease-out will-change-[width]",
        expanded ? "w-60" : "w-16",
        isCollapsed && isHoverExpanded && "shadow-2xl shadow-black/40",
        className
      )}
    >
      {/* Brand logo area */}
      <div className={cn(
        "h-[72px] flex items-center px-4 border-b border-border/40 bg-background/40",
        expanded ? "justify-start gap-2.5" : "justify-center"
      )}>
        <Link to="/" className="group flex items-center gap-2.5">
          <span className={cn(
            "relative grid place-items-center rounded-xl transition-all duration-300",
            "ring-1 ring-border/60 bg-card/70 backdrop-blur-xl h-10 w-10 shrink-0"
          )}>
            <img
              src={logo}
              alt="Asikon logo"
              className="w-6 h-6 object-contain"
            />
            <span
              aria-hidden
              className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "var(--gradient-primary-soft)" }}
            />
          </span>
          {expanded && (
            <div className="leading-none animate-fade-in">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                ​
              </p>
              <h1 className="font-display font-bold text-gradient text-xl">
                Asikon
              </h1>
            </div>
          )}
        </Link>
      </div>
      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        aria-label={isCollapsed ? "Expand sidebar (Ctrl/Cmd+B)" : "Collapse sidebar (Ctrl/Cmd+B)"}
        title={isCollapsed ? "Expand (Ctrl/Cmd+B)" : "Collapse (Ctrl/Cmd+B)"}
        className="absolute -right-3 top-4 z-50 h-6 w-6 rounded-full border border-border bg-background shadow-sm hover:bg-secondary"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <ScrollArea className="flex-1 py-4 [&>[data-radix-scroll-area-viewport]]:overscroll-contain">
        <div className="space-y-5 px-3">
          {/* Main Navigation */}
          <div className="space-y-0.5">
            {expanded && <GroupHeader id="menu" label="Menu" />}
            {(iconOnly || openGroups.menu) &&
              mainNavItems.map((item) =>
                renderItem(item, location.pathname === item.href)
              )}
          </div>

          <Separator className="mx-3 opacity-60" />

          <div className="space-y-0.5">
            {expanded && <GroupHeader id="library" label="Library" />}
            {(iconOnly || openGroups.library) &&
              shopNavItems.map((item) =>
                renderItem(item, location.pathname + location.search === item.href)
              )}
          </div>

          <Separator className="mx-3 opacity-60" />

          <div className="space-y-0.5">
            {expanded && <GroupHeader id="account" label="Account" />}
            {(iconOnly || openGroups.account) &&
              userNavItems.map((item) =>
                renderItem(item, location.pathname === item.href)
              )}
          </div>
        </div>
      </ScrollArea>


      {/* Bottom Navigation */}
      <div className="border-t border-border/60 p-3 space-y-0.5 bg-background/40">
        {bottomNavItems.map((item) =>
          renderItem(item, location.pathname === item.href)
        )}
      </div>
    </aside>
  );
}
