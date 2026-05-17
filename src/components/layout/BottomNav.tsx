import { Home, Compass, Sparkles, Users, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getActiveTab, TabId } from "@/lib/nav-map";

const tabs: { id: Exclude<TabId, null>; icon: typeof Home; label: string; path: string }[] = [
  { id: "home", icon: Home, label: "Home", path: "/" },
  { id: "explore", icon: Compass, label: "Explore", path: "/shop" },
  { id: "ai", icon: Sparkles, label: "AI", path: "/learn" },
  { id: "community", icon: Users, label: "Community", path: "/community" },
  { id: "profile", icon: User, label: "My Profile", path: "/profile" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const activeTab = getActiveTab(pathname);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-[9999] pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto max-w-lg px-3 pb-3">
        <div
          className={cn(
            "pointer-events-auto relative flex items-stretch justify-between gap-0.5",
            "h-[68px] px-2 rounded-[28px]",
            "bg-background/85 backdrop-blur-2xl",
            "border border-border/60",
            "shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)]"
          )}
        >
          {tabs.map((item) => (
            <NavItem key={item.path} item={item} active={activeTab === item.id} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  item,
  active,
}: {
  item: { icon: typeof Home; label: string; path: string };
  active: boolean;
}) {
  const Icon = item.icon;
  const { pathname } = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    if (active && pathname === item.path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // AI tab gets a subtle gradient accent when active to stand out as the hero tab
  const isAi = item.label === "AI";

  return (
    <NavLink
      to={item.path}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      onClick={handleClick}
      className="group relative flex-1 flex flex-col items-center justify-center gap-1 select-none touch-manipulation outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <span
        className={cn(
          "grid place-items-center h-9 w-9 rounded-xl transition-all duration-200",
          active
            ? isAi
              ? "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-[0_6px_16px_-4px_hsl(var(--primary)/0.6)] scale-105"
              : "bg-primary text-primary-foreground shadow-[0_6px_14px_-4px_hsl(var(--primary)/0.55)]"
            : "text-foreground/70 group-active:scale-95"
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
      </span>
      <span
        className={cn(
          "text-[10px] leading-none tracking-tight transition-colors truncate max-w-full px-0.5",
          active ? "font-semibold text-primary" : "font-medium text-muted-foreground"
        )}
      >
        {item.label}
      </span>
    </NavLink>
  );
}
