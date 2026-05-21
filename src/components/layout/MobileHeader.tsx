import { useRef } from "react";
import { ShoppingCart, Search, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { isInnerRoute, getRouteTitle, getActiveTab } from "@/lib/nav-map";
import logo from "@/assets/logo.png";

interface MobileHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  cartCount?: number;
}

const tabTitles: Record<string, string> = {
  home: "Asikon",
  explore: "Explore",
  ai: "AI Tutor",
  community: "Community",
  profile: "My Profile",
};

export function MobileHeader({ onMenuClick, onSearchClick, cartCount = 0 }: MobileHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const inner = isInnerRoute(pathname);
  const activeTab = getActiveTab(pathname);
  const tabTitle = activeTab ? tabTitles[activeTab] : "Asikon";
  const innerTitle = getRouteTitle(pathname);

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 liquid-nav",
        "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary/30 after:to-transparent"
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center justify-between h-13 px-3" style={{ height: 54 }}>
        {/* Left — back chevron on inner routes, otherwise logo + tab title */}
        {inner ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="flex items-center gap-1.5 -ml-1 pl-1.5 pr-3 py-1.5 rounded-2xl border border-border/40 bg-background/40 hover:bg-background/60 active:scale-95 transition-all min-w-0 shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.12)]"
          >
            <span className="flex items-center justify-center h-6 w-6 rounded-xl bg-primary/10">
              <ChevronLeft className="w-4 h-4 shrink-0 text-primary" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight truncate max-w-[220px]">{innerTitle}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex items-center gap-2 -ml-1 pl-1 pr-3 py-1 rounded-2xl border border-border/40 bg-background/40 hover:bg-background/60 active:scale-95 transition-all min-w-0 shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.12)]"
          >
            <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 ring-1 ring-primary/20">
              <img src={logo} alt="Asikon logo" className="w-6 h-6 shrink-0" />
            </span>
            <h1 className="text-[16px] font-bold text-gradient leading-none tracking-tight truncate">{tabTitle}</h1>
          </button>
        )}

        {/* Right — Search + Cart pill */}
        <div className="flex items-center gap-0.5 rounded-2xl border border-border/40 bg-background/40 px-1 py-1 shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.12)] backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSearchClick}
            aria-label="Search"
            className="h-9 w-9 rounded-xl hover:bg-primary/10 active:scale-95 transition"
          >
            <Search className="w-[18px] h-[18px]" />
          </Button>
          <span className="h-5 w-px bg-border/50" aria-hidden />
          <Link to="/cart" aria-label="Cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-xl hover:bg-primary/10 active:scale-95 transition"
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background shadow-[0_2px_6px_hsl(var(--primary)/0.45)]">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}


