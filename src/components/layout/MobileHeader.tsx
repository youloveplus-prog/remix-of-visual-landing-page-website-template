import { useRef } from "react";
import { ShoppingCart, Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { isInnerRoute, getRouteTitle, getActiveTab } from "@/lib/nav-map";
import logo from "@/assets/logo.png";

interface MobileHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
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

  return (
    <header
      ref={ref}
      data-app-header
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      className={cn(
        "fixed top-0 inset-x-0 z-40",
        "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
        scrolled
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/25 shadow-[0_1px_16px_-6px_hsl(0_0%_0%/0.10)]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="flex items-center justify-between px-4" style={{ height: 48 }}>
        {inner ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="flex items-center gap-1.5 -ml-1 active:opacity-50 transition-opacity duration-100"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground shrink-0" strokeWidth={2.2} />
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
            className="flex items-center gap-2 -ml-0.5 active:opacity-50 transition-opacity duration-100"
          >
            <img
              src={logo}
              alt="Asikon"
              className="h-7 w-7 rounded-[10px] object-contain shrink-0"
            />
            <span className="text-[17px] font-bold tracking-tight leading-none text-foreground">
              {tabTitle}
            </span>
          </button>
        )}

        <div className="flex items-center -mr-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            aria-label="Search"
            style={{ WebkitTapHighlightColor: "transparent" }}
            className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-transparent active:bg-transparent active:opacity-50 transition-opacity duration-100"
          >
            <Search className="h-[19px] w-[19px]" strokeWidth={2} />
          </Button>

          <Link to="/cart" aria-label="Cart">
            <Button
              variant="ghost"
              size="icon"
              style={{ WebkitTapHighlightColor: "transparent" }}
              className="relative h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-transparent active:bg-transparent active:opacity-50 transition-opacity duration-100"
            >
              <ShoppingCart className="h-[19px] w-[19px]" strokeWidth={2} />
              {cartCount > 0 && (
                <span
                  aria-label={`${cartCount} items in cart`}
                  className="absolute top-[9px] right-[9px] h-[7px] w-[7px] rounded-full bg-primary ring-[1.5px] ring-background shadow-[0_0_5px_hsl(var(--primary)/0.55)]"
                />
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
