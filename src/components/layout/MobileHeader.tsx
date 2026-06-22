import { useRef } from "react";
import { ChevronLeft, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { isInnerRoute, getRouteTitle, getActiveTab } from "@/lib/nav-map";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "@/components/layout/UserMenu";
import logo from "@/assets/logo.png";

interface MobileHeaderProps {
  onMenuClick: () => void;
  // Kept for API compatibility; unused on the new home-tab layout.
  onSearchClick?: () => void;
  cartCount?: number;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const scrolled = useScrollTop(8);
  const { user, loading } = useAuth();

  const inner = isInnerRoute(pathname);
  const activeTab = getActiveTab(pathname);
  const isHomeTab = !inner && activeTab === "home";
  const innerTitle = getRouteTitle(pathname);

  // === Inner-route header (back + title) — unchanged behaviour ===
  if (inner) {
    return (
      <header
        ref={ref}
        data-app-header
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          paddingLeft: "env(safe-area-inset-left, 0px)",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ease-out",
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border/60"
            : "bg-background/95 backdrop-blur-md border-b border-transparent",
        )}
      >
        <div className="relative mx-auto flex h-14 w-full max-w-screen-md items-center px-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground/80 transition hover:bg-foreground/[0.06] active:scale-[0.94]"
          >
            <ChevronLeft className="h-[22px] w-[22px]" strokeWidth={2.25} />
          </button>
          <h1 className="flex-1 truncate px-2 text-center text-[16px] font-semibold tracking-[-0.01em] text-foreground">
            {innerTitle}
          </h1>
          <div className="w-11" aria-hidden />
        </div>
      </header>
    );
  }

  // === Home-tab Higgsfield header: solid black, brand left, auth pills right ===
  return (
    <header
      ref={ref}
      data-app-header
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
      className="fixed top-0 inset-x-0 z-40 bg-black text-white"
    >
      <div className="relative mx-auto flex h-14 w-full max-w-screen-md items-center justify-between px-3 sm:px-4">
        {/* Left: brand cluster (40px tile + wordmark) */}
        <Link
          to="/"
          aria-label="Asikon home"
          className="inline-flex items-center gap-2.5"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-white shadow-[0_2px_6px_-2px_rgba(0,0,0,0.4)]">
            <img src={logo} alt="" className="h-7 w-7 object-contain" />
          </span>
          <span className="font-display text-[18px] font-bold leading-none tracking-[-0.015em] text-white">
            Asikon
          </span>
        </Link>

        {/* Hamburger sits between brand and pills only on very small screens
            when needed; kept hidden by default to mirror Higgsfield exactly.
            Sidebar still reachable via the bottom nav. */}
        {isHomeTab && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="sr-only"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Right: auth pills (signed-out) or user menu (signed-in) */}
        <div className="flex items-center gap-2">
          {loading ? (
            <span className="h-10 w-24 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <UserMenu />
          ) : (
            <>
              <Link
                to="/auth"
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-full px-5",
                  "bg-white text-black text-[14px] font-semibold tracking-tight",
                  "shadow-sm active:scale-[0.97] transition-transform",
                )}
              >
                Log in
              </Link>
              <Link
                to="/auth?mode=signup"
                className={cn(
                  "inline-flex h-10 items-center justify-center rounded-full px-5",
                  "bg-primary text-primary-foreground text-[14px] font-semibold tracking-tight",
                  "shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.6)]",
                  "active:scale-[0.97] transition-transform",
                )}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
