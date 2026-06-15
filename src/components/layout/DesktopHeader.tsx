import { useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { SmartSearch } from "@/components/search/SmartSearch";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { TrustStrip } from "./TrustStrip";
import { MegaMenu } from "./MegaMenu";
import { Breadcrumbs } from "./Breadcrumbs";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import logo from "@/assets/logo.png";

interface DesktopHeaderProps {
  showTrustStrip?: boolean;
  cartCount?: number;
  isSidebarCollapsed?: boolean;
}

export function DesktopHeader({
  showTrustStrip = true,
  cartCount = 0,
  isSidebarCollapsed = false,
}: DesktopHeaderProps) {
  const { isScrolled } = useScrollDirection();
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 z-40 transition-all duration-300",
        isSidebarCollapsed ? "left-16 right-0" : "left-60 right-0",
        "lg:left-0 lg:right-0"
      )}
    >
      {/* Trust strip — hidden on scroll */}
      <TrustStrip show={showTrustStrip && !isScrolled} />

      {/* Primary row — logo · mega menu · search · actions */}
      <div
        className={cn(
          "hairline-bottom transition-all duration-300",
          "bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55",
          isScrolled ? "py-1.5 shadow-[0_1px_0_0_hsl(var(--border)/0.6),0_8px_24px_-12px_hsl(var(--foreground)/0.08)]" : "py-2.5"
        )}
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(var(--glass-highlight) / 0.05), transparent 60%)",
        }}
      >
        <div className="container-editorial flex items-center gap-5">
          {/* Logo lockup */}
          <Link
            to="/"
            className="group flex-shrink-0 flex items-center gap-2.5"
            aria-label="Asikon — Home"
          >
            <span
              className={cn(
                "relative grid place-items-center rounded-xl transition-all duration-300",
                "ring-1 ring-border/60 bg-card/70 backdrop-blur-xl",
                "group-hover:ring-primary/40 group-hover:shadow-[var(--shadow-glow)]",
                isScrolled ? "h-9 w-9" : "h-10 w-10"
              )}
            >
              <img
                src={logo}
                alt=""
                className={cn(
                  "transition-all duration-300",
                  isScrolled ? "w-5 h-5" : "w-6 h-6"
                )}
              />
            </span>
            <h1
              className={cn(
                "font-display font-bold text-gradient leading-none tracking-tight transition-all duration-300",
                isScrolled ? "text-lg" : "text-xl"
              )}
            >
              Asikon
            </h1>
          </Link>

          {/* Mega menu — primary navigation */}
          <MegaMenu className="flex-shrink-0" />

          {/* Search — flexes to fill remaining space */}
          <SmartSearch className="flex-1 max-w-xl ml-auto" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <CurrencyToggle />
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl hover:bg-secondary/60"
                title="Cart"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount})` : ""}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-[var(--shadow-glow)] ring-2 ring-background">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <NotificationsMenu />
            <ThemeToggle />
            <div className="ml-1 pl-1 border-l border-border/60">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-row — Breadcrumbs only (collapses on scroll) */}
      <div
        className={cn(
          "hairline-bottom overflow-hidden transition-all duration-300",
          "bg-background/40 backdrop-blur-xl",
          isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100 py-1.5"
        )}
      >
        <div className="container-editorial">
          <Breadcrumbs />
        </div>
      </div>
    </header>
  );
}
