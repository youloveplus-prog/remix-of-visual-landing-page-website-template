import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Returns a ref + `inView` boolean that flips true the first time the element
 * enters the viewport. Under prefers-reduced-motion, `inView` is true on mount
 * so CSS-only animations collapse to their final state immediately.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "0px 0px -10% 0px",
) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (reduced) {
      setInView(true);
      return;
    }
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, reduced]);

  return { ref, inView };
}
