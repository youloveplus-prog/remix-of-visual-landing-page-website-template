import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Subtle scroll-linked parallax. Returns a ref + `offset` (px) you can
 * apply to a `transform`. Honors prefers-reduced-motion (always returns 0).
 *
 * `strength` = max pixels to translate at the extremes of the viewport.
 * Positive offset = element pushed UP as the user scrolls down.
 */
export function useScrollParallax<T extends HTMLElement = HTMLDivElement>(
  strength = 24,
) {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    let inView = false;
    let raf = 0;

    const tick = () => {
      if (!inView || !el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
      setOffset(Math.max(-1, Math.min(1, progress)) * strength);
      raf = window.requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        if (inView) tick();
      },
      { threshold: 0, rootMargin: "100px 0px 100px 0px" },
    );
    io.observe(el);

    const onScroll = () => {
      if (!inView) return;
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, [strength, reduced]);

  return { ref, offset };
}
