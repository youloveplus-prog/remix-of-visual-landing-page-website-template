import { useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useHeaderHidden } from "@/hooks/use-header-visibility";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { SmartSearch } from "@/components/search/SmartSearch";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { MegaMenu } from "./MegaMenu";
import { HeaderBrand } from "./HeaderBrand";


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
  const { hidden, scrollY } = useHeaderHidden();
  const isScrolled = scrollY > 8;

  const ref = useRef<HTMLElement>(null);
  useMeasuredHeaderHeight(ref);

  return (
    <header
      ref={ref}
      data-app-header
      className={cn(
        "fixed top-0 z-40 isolate overflow-visible",
        "transition-[left,right,transform] duration-300 ease-out will-change-transform",
        isSidebarCollapsed ? "left-16 right-0" : "left-60 right-0",
        "lg:left-0 lg:right-0",
        hidden && "-translate-y-full"
      )}
    >

      {/* Row 1 — brand · search · actions */}
      <div
        className={cn(
          "relative z-[2] overflow-visible py-1",
          "transition-[box-shadow] duration-300 ease-out",
          "bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/65",
          "dark:bg-black/85 dark:supports-[backdrop-filter]:bg-black/75",
          "border-b border-border/50 dark:border-white/10",
          isScrolled && "shadow-[0_8px_24px_-16px_hsl(0_0%_0%/0.3)]"
        )}
      >
        <div className="container-editorial flex items-center gap-3">
          <HeaderBrand compact={isScrolled} />
          <SmartSearch className="flex-1 max-w-xl ml-auto" />
          <div className="flex items-center gap-0.5">
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
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <NotificationsMenu />
            <UserMenu />
          </div>
        </div>
      </div>

      {/* Row 2 — primary navigation */}
      <div
        className={cn(
          "relative z-[1] py-0.5 overflow-visible",
          "bg-background/60 backdrop-blur-xl",
          "dark:bg-black/70",
          "border-b border-border/40 dark:border-white/5"
        )}
      >
        <div className="container-editorial flex items-center">
          <MegaMenu />
        </div>
      </div>
    </header>
  );
}
