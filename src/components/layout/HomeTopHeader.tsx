import { useRef } from "react";
import { Search, ShoppingCart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHeaderHidden } from "@/hooks/use-header-visibility";
import { useMeasuredHeaderHeight } from "@/hooks/use-measured-header-height";
import { UserMenu } from "./UserMenu";
import { NotificationsMenu } from "./NotificationsMenu";
import { HeaderBrand } from "./HeaderBrand";

interface HomeTopHeaderProps {
  cartCount?: number;
}

type Badge = "new" | "hot" | "free" | null;
type NavItem = { label: string; to: string; badge?: Badge };

const NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Explore", to: "/shop", badge: "hot" },
  { label: "Courses", to: "/shop?type=courses", badge: "new" },
  { label: "Prompts", to: "/prompts" },
  { label: "AI Tutor", to: "/learn", badge: "new" },
  { label: "Mentors", to: "/mentors" },
  { label: "Community", to: "/community" },
  { label: "Resources", to: "/resources", badge: "free" },
  { label: "Game", to: "/game" },
  { label: "About", to: "/about" },
];

const BADGE_STYLES: Record<Exclude<Badge, null>, string> = {
  new: "bg-primary text-primary-foreground",
  hot: "bg-destructive/90 text-destructive-foreground",
  free: "bg-accent text-accent-foreground",
};

function NavBadge({ badge }: { badge: Exclude<Badge, null> }) {
  return (
    <span
      className={cn(
        "ml-1 inline-flex items-center rounded-full px-1.5 py-[1px] font-dot text-[9px] uppercase tracking-[0.12em] leading-none",
        BADGE_STYLES[badge]
      )}
    >
      {badge}
    </span>
  );
}

/**
 * Higgsfield-style top header used on the home page:
 * promo strip + dense single-row nav with badge-tagged links + right-side actions.
 */
export function HomeTopHeader({ cartCount = 0 }: HomeTopHeaderProps) {
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
      {/* Promo strip */}
      <Link
        to="/shop?filter=deals"
        className="group block bg-primary text-primary-foreground"
      >
        <div className="container-editorial flex items-center justify-center gap-2 py-1.5 text-[12px] sm:text-[13px]">
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="font-dot uppercase tracking-[0.18em] text-[10px] sm:text-[11px]">
            Skill-Up Friday
          </span>
          <span className="hidden sm:inline opacity-90">
            50% off every course this week —
          </span>
          <span className="font-semibold underline underline-offset-2 decoration-from-font group-hover:opacity-90">
            Claim offer
          </span>
        </div>
      </Link>

      {/* Main nav row */}
      <div
        className={cn(
          "relative z-[2] liquid-nav border-b border-border/50 dark:border-white/10",
          "transition-[box-shadow] duration-300",
          isScrolled && "shadow-[0_8px_24px_-16px_hsl(0_0%_0%/0.3)]"
        )}
      >
        <div className="container-editorial flex items-center gap-4 py-2">
          <HeaderBrand compact={isScrolled} />

          {/* Horizontal scrollable nav links */}
          <nav
            aria-label="Primary"
            className={cn(
              "min-w-0 flex-1 overflow-x-auto scrollbar-hide",
              "[mask-image:linear-gradient(to_right,transparent,#000_24px,#000_calc(100%-24px),transparent)]"
            )}
          >
            <ul className="flex items-center gap-0.5 px-2 whitespace-nowrap">
              {NAV_ITEMS.map((item) => (
                <li key={item.to + item.label}>
                  <Link
                    to={item.to}
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1.5",
                      "text-[13px] font-medium text-foreground/80",
                      "hover:text-foreground hover:bg-secondary/70 transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                  >
                    {item.label}
                    {item.badge && <NavBadge badge={item.badge} />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right-side actions */}
          <div className="flex items-center gap-0.5 shrink-0">
            <Link to="/search" aria-label="Search">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary/60">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
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
            <Link to="/shop?filter=premium" className="ml-1 hidden sm:inline-flex">
              <Button
                size="sm"
                className="h-9 rounded-full px-4 font-semibold bg-foreground text-background hover:bg-foreground/90"
              >
                Go Premium
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
