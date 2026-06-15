import { useRef } from "react";
import { ChevronLeft, Search, ShoppingBag } from "lucide-react";
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
  home: "Asikon",
  explore: "Explore",
  ai: "AI Tutor",
  community: "Community",
  profile: "Profile",
};

export function MobileHeader({ onMenuClick, onSearchClick, cartCount = 0 }: MobileHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const scrolled = useScrollTop(8);

  const inner = isInnerRoute(pathname);
  const activeTab = getActiveTab(pathname);
  const tabTitle = (activeTab && TAB_TITLES[activeTab]) ?? "Asikon";
  const innerTitle = getRouteTitle(pathname);

  const iconBtnCls = cn(
    "relative w-11 h-11 rounded-full bg-transparent border-0",
    "flex items-center justify-center text-foreground/70 hover:text-foreground",
    "active:opacity-50 transition-opacity duration-100",
  );

  return (
    <header
      ref={ref}
      data-app-header
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-[box-shadow,border-color,background-color] duration-300 ease-out",
        "bg-[linear-gradient(to_bottom,hsl(var(--primary)/0.16),hsl(var(--primary)/0.04)_55%,hsl(var(--background))_100%)]",
        "dark:bg-[linear-gradient(to_bottom,hsl(var(--primary)/0.26),hsl(var(--primary)/0.06)_55%,hsl(var(--background))_100%)]",
        "backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
        scrolled
          ? "border-b border-border/40 shadow-[0_2px_18px_-8px_hsl(0_0%_0%/0.18)]"
          : "border-b border-transparent",
      )}
    >
      <div className="relative flex items-center gap-2 px-3" style={{ height: 44 }}>
        {inner ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="flex items-center gap-1.5 -ml-1 active:opacity-50 transition-opacity duration-100 min-w-0"
          >
            <ChevronLeft className="h-5 w-5 text-foreground shrink-0" strokeWidth={2.2} />
            <span className="text-[15px] font-semibold tracking-tight text-foreground truncate max-w-[180px]">
              {innerTitle}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="flex items-center gap-2 active:opacity-70 transition-opacity duration-100"
          >
            <img src={logo} alt="Asikon" className="h-7 w-7 rounded-md object-contain" />
            <span className="font-display font-semibold text-[17px] tracking-tight text-foreground">
              {tabTitle}
            </span>
          </button>
        )}

        <div className="ml-auto flex items-center gap-0.5">
          {onSearchClick && (
            <button
              type="button"
              onClick={onSearchClick}
              aria-label="Search"
              style={{ WebkitTapHighlightColor: "transparent" }}
              className={iconBtnCls}
            >
              <Search className="h-[20px] w-[20px]" strokeWidth={2} />
            </button>
          )}
          <Link
            to="/cart"
            aria-label="Cart"
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={iconBtnCls}
          >
            <ShoppingBag className="h-[20px] w-[20px]" strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
