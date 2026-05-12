import { Home, Library, Gamepad2, Users, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useRef, PointerEvent } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Library, label: "Library", path: "/shop" },
  { icon: Gamepad2, label: "Game", path: "/game" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: User, label: "Profile", path: "/profile" },
];

/**
 * Persistent app-shell bottom navigation with native-feeling press feedback.
 * - Mounted ONCE at the App root → never blinks on route changes.
 * - Sliding active pill, scale-on-press icon, and a subtle ripple on tap.
 */
export function BottomNav() {
  const location = useLocation();

  const activeIndex = useMemo(() => {
    const idx = navItems.findIndex(
      (item) =>
        location.pathname === item.path ||
        (item.path !== "/" && location.pathname.startsWith(item.path))
    );
    return idx === -1 ? 0 : idx;
  }, [location.pathname]);

  const itemWidthPct = 100 / navItems.length;

  // Spawn a small ripple at the touch/click point — pure DOM, no re-renders.
  const spawnRipple = (e: PointerEvent<HTMLAnchorElement>) => {
    const host = e.currentTarget.querySelector<HTMLSpanElement>("[data-ripple-host]");
    if (!host) return;
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.6;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const dot = document.createElement("span");
    dot.className =
      "pointer-events-none absolute rounded-full bg-primary/25 will-change-transform";
    dot.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;transform:scale(0);opacity:0.55;transition:transform 480ms cubic-bezier(0.22,1,0.36,1),opacity 520ms ease-out;`;
    host.appendChild(dot);
    requestAnimationFrame(() => {
      dot.style.transform = "scale(1)";
      dot.style.opacity = "0";
    });
    window.setTimeout(() => dot.remove(), 560);
  };

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[9999]",
        "border-t border-border/60",
        "bg-background/80 backdrop-blur-xl",
        "supports-[backdrop-filter]:bg-background/60",
        "shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)]"
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        transform: "translateZ(0)",
        willChange: "transform",
        contain: "layout paint",
      }}
    >
      <div className="relative mx-auto flex h-16 max-w-lg items-stretch">
        {/* Sliding active indicator pill */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-1.5 h-11 rounded-2xl bg-primary/10 ring-1 ring-primary/15"
          style={{
            width: `calc(${itemWidthPct}% - 12px)`,
            left: `calc(${activeIndex * itemWidthPct}% + 6px)`,
            transition:
              "left 320ms cubic-bezier(0.22, 1, 0.36, 1), width 320ms cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "left, width",
          }}
        />

        {navItems.map((item, i) => {
          const isActive = i === activeIndex;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              onPointerDown={spawnRipple}
              className={cn(
                "group relative z-10 flex flex-1 flex-col items-center justify-center gap-0.5",
                "select-none touch-manipulation outline-none",
                "transition-colors duration-200",
                "active:[&_[data-press]]:scale-[0.92]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {/* Ripple host — clips overflowing ripples to a rounded pill */}
              <span
                data-ripple-host
                aria-hidden
                className="pointer-events-none absolute top-1.5 h-11 overflow-hidden rounded-2xl"
                style={{ left: 6, right: 6 }}
              />

              <span
                data-press
                className="relative z-10 flex flex-col items-center gap-0.5 transition-transform duration-150 ease-out"
              >
                <Icon
                  className={cn(
                    "h-[22px] w-[22px] transition-transform duration-300",
                    isActive ? "scale-110" : "scale-100"
                  )}
                  strokeWidth={isActive ? 2.4 : 2}
                />
                <span
                  className={cn(
                    "text-[10.5px] leading-none tracking-tight transition-all duration-200",
                    isActive ? "font-semibold opacity-100" : "font-medium opacity-80"
                  )}
                >
                  {item.label}
                </span>
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
