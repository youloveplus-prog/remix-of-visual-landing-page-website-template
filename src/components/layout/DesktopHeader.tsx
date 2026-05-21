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
import { NavigationMenu } from "./NavigationMenu";
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

      {/* Row 1 — main header, true glass */}
      <div
        className={cn(
          "hairline-bottom transition-all duration-300",
          "bg-background/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55",
          "[mask-image:linear-gradient(to_bottom,black,black)]",
          isScrolled ? "py-2" : "py-3"
        )}
        style={{
          // Subtle top sheen
          backgroundImage:
            "linear-gradient(180deg, hsl(var(--glass-highlight) / 0.04), transparent 60%)",
        }}
      >
        <div
          className={cn(
            "container-editorial flex items-center gap-6 transition-all duration-300"
          )}
        >
          {/* Left — Logo lockup */}
          <Link to="/" className="group flex-shrink-0 flex items-center gap-2.5">
            <span
              className={cn(
                "relative grid place-items-center rounded-xl transition-all duration-300",
                "ring-1 ring-border/60 bg-card/70 backdrop-blur-xl",
                isScrolled ? "h-9 w-9" : "h-10 w-10"
              )}
            >
              <img
                src={logo}
                alt="Asikon logo"
                className={cn(
                  "transition-all duration-300",
                  isScrolled ? "w-5 h-5" : "w-6 h-6"
                )}
              />
              <span
                aria-hidden
                className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "var(--gradient-primary-soft)" }}
              />
            </span>
            <div className="leading-none">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                ​
              </p>
              <h1
                className={cn(
                  "font-display font-bold text-gradient transition-all duration-300",
                  isScrolled ? "text-lg text-gray-50" : "text-xl"
                )}
              >
                Asikon
              </h1>
            </div>
          </Link>

          {/* Center — Search */}
          <SmartSearch className="flex-1 max-w-2xl mx-auto" />

          {/* Right — Actions */}
          <div className="flex items-center gap-1.5">
            <CurrencyToggle />
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl hover:bg-secondary/60"
                title="Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-[var(--shadow-glow)]">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <NotificationsMenu />
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Row 2 — Nav menu */}
      <div
        className={cn(
          "hairline-bottom transition-all duration-300",
          "bg-background/40 backdrop-blur-xl",
          isScrolled ? "h-0 overflow-hidden opacity-0" : "py-2"
        )}
      >
        <div className="container-editorial flex items-center justify-between gap-4">
          <Breadcrumbs />
          <NavigationMenu />
          <span aria-hidden className="hidden lg:block w-[1px]" />
        </div>

      </div>
    </header>
  );
}
