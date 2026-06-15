import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref + `inView` boolean that flips true the first time the element
 * enters the viewport. Used to trigger CSS-only entrance animations on spreads.
 * Always returns true under prefers-reduced-motion (animation collapses to its
 * final state).
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "0px 0px -10% 0px",
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setInView(true);
      return;
    }
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
  }, [rootMargin]);

  return { ref, inView };
}
