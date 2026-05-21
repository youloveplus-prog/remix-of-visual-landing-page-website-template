import { House, Compass, Wand2, Users, CircleUser } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getActiveTab, TabId } from "@/lib/nav-map";

const tabs: { id: Exclude<TabId, null>; icon: typeof House; label: string; path: string }[] = [
  { id: "home", icon: House, label: "Home", path: "/" },
  { id: "explore", icon: Compass, label: "Explore", path: "/shop" },
  { id: "ai", icon: Wand2, label: "AI", path: "/learn" },
  { id: "community", icon: Users, label: "Community", path: "/community" },
  { id: "profile", icon: CircleUser, label: "Profile", path: "/profile" },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const activeTab = getActiveTab(pathname);

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50",
        "liquid-nav border-t border-border/40"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-5 h-[60px]">
        {tabs.map((item) => (
          <NavItem key={item.path} item={item} active={activeTab === item.id} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({
  item,
  active,
}: {
  item: { icon: typeof House; label: string; path: string };
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

  return (
    <NavLink
      to={item.path}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      onClick={handleClick}
      className="relative flex flex-col items-center justify-center gap-0.5 select-none touch-manipulation outline-none group"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Active pill background */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-3 top-1.5 bottom-1.5 rounded-2xl transition-all duration-300",
          active
            ? "bg-primary/12 scale-100 opacity-100 shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.18)]"
            : "scale-90 opacity-0 group-active:opacity-50 group-active:scale-95"
        )}
      />
      <Icon
        className={cn(
          "relative h-[22px] w-[22px] transition-all duration-300 ease-out",
          active ? "text-primary scale-110 -translate-y-px" : "text-muted-foreground"
        )}
        strokeWidth={active ? 2.4 : 1.9}
      />
      <span
        className={cn(
          "relative text-[10px] leading-none tracking-tight transition-colors duration-200",
          active ? "font-semibold text-primary" : "font-medium text-muted-foreground"
        )}
      >
        {item.label}
      </span>
    </NavLink>
  );
}
