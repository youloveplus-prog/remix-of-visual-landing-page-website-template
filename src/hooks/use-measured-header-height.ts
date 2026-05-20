import { useLayoutEffect, RefObject } from "react";

/**
 * Measures the live offsetHeight of a header element (including its own
 * safe-area-inset padding) and publishes it as the global CSS variable
 * `--app-header-h` on <html>. This becomes the single source of truth for
 * every sticky offset in the app (sticky tab bars, main content padding, etc.)
 * and stays accurate across:
 *   - device rotation
 *   - dynamic browser chrome (mobile URL bar)
 *   - safe-area changes (notch / status-bar variations)
 *   - layout/font changes that affect header height
 *   - header swap between Mobile/Desktop on viewport changes
 */
export function useMeasuredHeaderHeight(ref: RefObject<HTMLElement>) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      const h = el.offsetHeight;
      // eslint-disable-next-line no-console
      console.log("[hdr]", h, el.tagName, el.className?.toString().slice(0, 40));
      if (h > 0) {
        document.documentElement.style.setProperty("--app-header-h", `${h}px`);
      }
    };

    // Measure now (sync, pre-paint) and again after layout/fonts settle so
    // a stale value from a sibling header that just unmounted doesn't stick.
    apply();
    const raf = requestAnimationFrame(apply);
    const t1 = window.setTimeout(apply, 50);
    const t2 = window.setTimeout(apply, 250);

    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener("orientationchange", apply);
    window.addEventListener("resize", apply);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("orientationchange", apply);
      window.removeEventListener("resize", apply);
      // Drop the inline value so a sibling header (e.g. Desktop→Mobile swap)
      // doesn't inherit a stale height before its own effect runs.
      document.documentElement.style.removeProperty("--app-header-h");
    };
  }, [ref]);
}
