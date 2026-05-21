import { useEffect, useState } from "react";

/**
 * Single source of truth for motion preferences. Components should call this
 * once and gate non-essential motion (parallax, autoplay carousels, infinite
 * shimmer, hover-tilt) behind `prefersReducedMotion`. Listens for live
 * changes so toggling the OS setting takes effect without a refresh.
 */
export function useMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  return { prefersReducedMotion };
}
