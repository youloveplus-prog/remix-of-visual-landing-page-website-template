import { useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { SmartSearch } from "@/components/search/SmartSearch";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { Breadcrumbs } from "./Breadcrumbs";
import { MegaMenu, BrowseMenu } from "./MegaMenu";
import { HeaderBrand } from "./HeaderBrand";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";


interface SlimDesktopHeaderProps {
  cartCount?: number;
  isSidebarCollapsed?: boolean;
}

/**
 * Compact two-row header for non-home pages. Sits to the right of the sidebar.
 * Row 1: mega menu + search + actions. Row 2: breadcrumbs (collapses on scroll).
 */
export function SlimDesktopHeader({
  cartCount = 0,
  isSidebarCollapsed = false,
}: SlimDesktopHeaderProps) {
  const { isScrolled } = useScrollDirection();
  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 right-0 z-40 transition-all duration-300",
        isSidebarCollapsed ? "left-16" : "left-60"
      )}
    >
      {/* Row 1 — Brand + Mega menu (or Browse) + Search + Actions */}
      <div
        className={cn(
          "hairline-bottom transition-all duration-300",
          "bg-background/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60",
          "shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.06)]",
          isScrolled
            ? "py-1.5 shadow-[0_1px_0_0_hsl(var(--border)/0.6),0_8px_24px_-12px_hsl(var(--foreground)/0.08)]"
            : "py-2"
        )}
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(var(--glass-highlight) / 0.05), transparent 60%)",
        }}
      >
        <div className="flex items-center gap-3 px-4 lg:px-6">
          {/* Brand anchor — always visible */}
          <HeaderBrand compact={isScrolled} />

          {/* Subtle divider */}
          <span aria-hidden className="hidden md:block h-7 w-px bg-border/60" />

          {/* Primary navigation — mega menu at md+, compact Browse below */}
          <MegaMenu className="flex-shrink-0 min-w-0" />
          <BrowseMenu />

          {/* Search */}
          <SmartSearch className="flex-1 max-w-md ml-auto" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <CurrencyToggle />
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-xl hover:bg-secondary/60"
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


      {/* Row 2 — Breadcrumbs (collapses on scroll) */}
      <div
        className={cn(
          "hairline-bottom overflow-hidden transition-all duration-300",
          "bg-background/40 backdrop-blur-xl",
          isScrolled ? "max-h-0 opacity-0" : "max-h-10 opacity-100 py-1.5"
        )}
      >
        <div className="px-4 lg:px-6">
          <Breadcrumbs />
        </div>
      </div>
    </header>
  );
}
