import { useRef } from "react";
import { ChevronLeft, Menu, Search, ShoppingBag } from "lucide-react";
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

  // Unified icon button — circular tap target, soft hover surface,
  // proper 44px tap area, no aggressive opacity flicker.
  const iconBtnCls = cn(
    "relative inline-flex items-center justify-center shrink-0",
    "w-11 h-11 rounded-full text-foreground/80",
    "transition-[background-color,color,transform] duration-150 ease-out",
    "hover:bg-foreground/[0.06] hover:text-foreground",
    "active:scale-[0.94] active:bg-foreground/[0.09]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0",
  );

  return (
    <header
      ref={ref}
      data-app-header
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      className={cn(
        "fixed top-0 inset-x-0 z-40",
        "transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
        scrolled
          ? "bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65 border-b border-border/60 shadow-[0_1px_0_0_hsl(var(--border)/0.4),0_8px_24px_-16px_hsl(0_0%_0%/0.18)]"
          : "bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/75 border-b border-transparent",
      )}
    >
      <div
        className={cn(
          "relative flex items-center px-2.5",
          "h-14 transition-[height] duration-200",
        )}
      >
        {/* Left */}
        <div className="flex items-center shrink-0">
          {inner ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              style={{ WebkitTapHighlightColor: "transparent" }}
              className={iconBtnCls}
            >
              <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.25} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open menu"
              style={{ WebkitTapHighlightColor: "transparent" }}
              className={iconBtnCls}
            >
              <Menu className="h-[22px] w-[22px]" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Center */}
        <div className="flex-1 flex items-center justify-center min-w-0 px-2">
          {inner ? (
            <h1 className="text-[16px] font-semibold tracking-[-0.01em] text-foreground truncate max-w-full">
              {innerTitle}
            </h1>
          ) : (
            <Link
              to="/"
              aria-label="Asikon home"
              className="inline-flex items-center gap-2 group"
            >
              <span className="relative inline-flex items-center justify-center h-7 w-7 rounded-lg bg-primary/10 ring-1 ring-primary/15 overflow-hidden">
                <img src={logo} alt="" className="h-5 w-5 object-contain" />
              </span>
              <span className="font-display font-semibold text-[17px] leading-none tracking-[-0.02em] text-foreground">
                {tabTitle}
              </span>
            </Link>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-0.5 shrink-0">
          {onSearchClick && (
            <button
              type="button"
              onClick={onSearchClick}
              aria-label="Search"
              style={{ WebkitTapHighlightColor: "transparent" }}
              className={iconBtnCls}
            >
              <Search className="h-[21px] w-[21px]" strokeWidth={2} />
            </button>
          )}
          <Link
            to="/cart"
            aria-label={cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}` : "Cart"}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={iconBtnCls}
          >
            <ShoppingBag className="h-[21px] w-[21px]" strokeWidth={2} />
            {cartCount > 0 && (
              <span
                className={cn(
                  "absolute top-1 right-1 min-w-[17px] h-[17px] px-[5px]",
                  "rounded-full bg-primary text-primary-foreground",
                  "text-[10px] font-bold leading-none tabular-nums",
                  "flex items-center justify-center",
                  "ring-2 ring-background shadow-sm",
                )}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
