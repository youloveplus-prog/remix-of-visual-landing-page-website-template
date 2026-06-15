import { useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHeaderHidden } from "@/hooks/use-header-visibility";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { SmartSearch } from "@/components/search/SmartSearch";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { TrustStrip } from "./TrustStrip";
import { MegaMenu } from "./MegaMenu";
import { HeaderBrand } from "./HeaderBrand";
import { CurrencyToggle } from "@/components/ui/currency-toggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";


interface HomeTopHeaderProps {
  showTrustStrip?: boolean;
  cartCount?: number;
}

/**
 * Full-width top header used only on the home page.
 * Features a mega menu. No sidebar is rendered on home.
 */
export function HomeTopHeader({ showTrustStrip = true, cartCount = 0 }: HomeTopHeaderProps) {
  const { hidden, scrollY } = useHeaderHidden();
  const isScrolled = scrollY > 8;

  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 isolate overflow-visible",
        "transition-transform duration-300 ease-out will-change-transform",
        hidden && "-translate-y-full"
      )}
    >
      {/* Section 1 — Core: logo, search (center), actions */}
      <div
        className={cn(
          "hairline-bottom relative z-[2] overflow-visible py-2",
          "transition-[box-shadow,background-color] duration-300",
          "bg-background/55 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55",
          "border-b border-primary/15",
          "shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.08),inset_0_-1px_0_hsl(var(--primary)/0.12)]",
          isScrolled && "shadow-[0_1px_0_0_hsl(var(--primary)/0.25),0_10px_30px_-14px_hsl(var(--primary)/0.35)]"
        )}



        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(var(--glass-highlight) / 0.04), transparent 60%)",
        }}
      >
        <div className="container-editorial grid grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* Brand (left) */}
          <HeaderBrand compact={isScrolled} />


          {/* Search (center) */}
          <SmartSearch className="w-full max-w-2xl mx-auto" />

          {/* Actions (right) */}
          <div className="flex items-center gap-1.5 justify-self-end">
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

      {/* Section 2 — Premium Mega Menu band (always visible so users can access nav after scroll) */}
      <div
        className={cn(
          "hairline-bottom relative z-[1] py-1 overflow-visible",
          "transition-[background-color] duration-300",
          "bg-background/40 backdrop-blur-xl",
          "shadow-[inset_0_1px_0_hsl(var(--glass-highlight)/0.06)]"
        )}
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(var(--primary) / 0.06), transparent 70%), radial-gradient(60% 80% at 50% 0%, hsl(var(--primary) / 0.08), transparent 70%)",
        }}
      >


        <div className="container-editorial flex items-center justify-center">
          <MegaMenu />
        </div>
      </div>
    </header>
  );
}
