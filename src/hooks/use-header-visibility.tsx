import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";

/**
 * Tracks whether any header-owned overlay (mega menu panel) is currently open.
 * When something is open, the header must NOT hide on scroll — otherwise the
 * panel would be torn from under the user's cursor.
 */
interface HeaderMenuOpenCtx {
  isAnyOpen: boolean;
  setOpen: (key: string, open: boolean) => void;
}

const Ctx = createContext<HeaderMenuOpenCtx>({
  isAnyOpen: false,
  setOpen: () => {},
});

export function HeaderMenuOpenProvider({ children }: { children: ReactNode }) {
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());

  const setOpen = useCallback((key: string, open: boolean) => {
    setOpenSet((prev) => {
      const has = prev.has(key);
      if (open && has) return prev;
      if (!open && !has) return prev;
      const next = new Set(prev);
      if (open) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ isAnyOpen: openSet.size > 0, setOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export function useHeaderMenuOpen() {
  return useContext(Ctx);
}

/**
 * Returns whether the header should be hidden (translated off-screen).
 * - Always visible near the top of the page (< NEAR_TOP px).
 * - Visible when scrolling up.
 * - Visible whenever a mega-menu panel is open.
 * - Hidden when scrolling down past NEAR_TOP.
 */
const NEAR_TOP = 80;
const DELTA = 8;

export function useHeaderHidden(): { hidden: boolean; scrollY: number } {
  const { isAnyOpen } = useHeaderMenuOpen();
  const [hidden, setHidden] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY.current;

        if (Math.abs(dy) > DELTA) {
          if (y < NEAR_TOP) {
            setHidden(false);
          } else if (dy > 0) {
            setHidden(true);
          } else {
            setHidden(false);
          }
          lastY.current = y;
        }
        setScrollY(y);
        ticking.current = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Force visible while any menu is open.
  if (isAnyOpen && hidden) {
    return { hidden: false, scrollY };
  }
  return { hidden, scrollY };
}
