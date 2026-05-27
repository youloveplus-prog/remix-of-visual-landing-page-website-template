import { useRef } from "react";
import { Bell, ChevronLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { isInnerRoute, getRouteTitle, getActiveTab } from "@/lib/nav-map";
import logo from "@/assets/logo.png";

interface MobileHeaderProps {
  onMenuClick: () => void;
  onSearchClick?: () => void;
  cartCount?: number;
}

const TAB_TITLES: Record<string, string> = {
  home: "ASIKON",
  explore: "Explore",
  ai: "AI Tutor",
  community: "Community",
  profile: "Profile",
};

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const scrolled = useScrollTop(8);

  const inner = isInnerRoute(pathname);
  const activeTab = getActiveTab(pathname);
  const tabTitle = (activeTab && TAB_TITLES[activeTab]) ?? "ASIKON";
  const innerTitle = getRouteTitle(pathname);

  return (
    <header
      ref={ref}
      data-app-header
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-[box-shadow,border-color] duration-300 ease-out",
        "bg-gradient-to-b from-sky-200 via-sky-100 to-background dark:from-sky-900/40 dark:via-sky-950/30 dark:to-background",
        scrolled
          ? "border-b border-border/30 shadow-[0_1px_16px_-6px_hsl(0_0%_0%/0.10)]"
          : "border-b border-transparent",
      )}
    >
      <div className="relative flex items-center justify-between px-4" style={{ height: 56 }}>
        {inner ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="flex items-center gap-1.5 -ml-1 active:opacity-50 transition-opacity duration-100"
          >
            <ChevronLeft className="h-5 w-5 text-foreground shrink-0" strokeWidth={2.2} />
            <span className="text-[15px] font-semibold tracking-tight text-foreground truncate max-w-[200px]">
              {innerTitle}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="w-10 h-10 rounded-full bg-white border border-white/60 shadow-sm flex items-center justify-center active:opacity-70 transition-opacity duration-100"
          >
            <img
              src={logo}
              alt="Asikon"
              className="h-6 w-6 rounded-md object-contain"
            />
          </button>
        )}

        {!inner && (
          <span className="absolute left-1/2 -translate-x-1/2 font-display font-bold tracking-[0.25em] text-sm text-foreground">
            {tabTitle}
          </span>
        )}

        <Link
          to="/profile"
          aria-label="Notifications"
          style={{ WebkitTapHighlightColor: "transparent" }}
          className="relative w-10 h-10 rounded-full bg-white border border-white/60 shadow-sm flex items-center justify-center active:opacity-70 transition-opacity duration-100"
        >
          <Bell className="h-4 w-4 text-foreground" strokeWidth={2} />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Link>
      </div>
    </header>
  );
}
