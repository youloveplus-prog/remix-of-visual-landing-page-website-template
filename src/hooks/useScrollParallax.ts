import { useEffect, useRef, useState } from "react";

/**
 * Subtle scroll-linked parallax. Returns a ref + a `translateY` (px) you can
 * spread onto a `style` prop. Honors prefers-reduced-motion (returns 0).
 *
 * `strength` = max pixels to translate at the extremes of the viewport.
 * Positive values move the element UP as the user scrolls down.
 */
export function useScrollParallax<T extends HTMLElement = HTMLDivElement>(
  strength = 24,
) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const el = ref.current;
    if (!el) return;

    let inView = false;
    let raf = 0;

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        if (inView) tick();
      },
      { threshold: 0, rootMargin: "100px 0px 100px 0px" },
    );
    io.observe(el);

    const tick = () => {
      if (!inView || !el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: -1 (entering bottom) → 0 (center) → 1 (leaving top)
      const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
      setOffset(Math.max(-1, Math.min(1, progress)) * strength);
      raf = window.requestAnimationFrame(tick);
    };

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
  }, [strength]);

  return { ref, offset };
}
