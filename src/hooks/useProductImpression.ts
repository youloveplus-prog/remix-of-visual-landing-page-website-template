import { useEffect, useRef } from "react";
import {
  logProductImpression,
  type ProductImpressionEvent,
} from "@/lib/productAnalytics";

interface Product {
  id: string | number;
  name: string;
  price?: number;
  slug?: string;
}

interface ImpressionState {
  /** Highest intersectionRatio observed so far (0–1). */
  maxVisibility: number;
  /** Cumulative ms the card was at least 50% visible. */
  dwellMs: number;
  /** Timestamp when card last became visible, or null when hidden. */
  visibleSince: number | null;
  /** True once we've flushed (or scheduled) at least one impression. */
  flushed: boolean;
}

/**
 * Tracks how visible a ProductCard becomes before a click — impression +
 * scroll depth. Each card flushes at most one impression per mount, on the
 * first of: minimum dwell reached, scroll past, unmount, or page hide.
 *
 * Resilient by design:
 *  - SSR / no-IntersectionObserver → silently no-op (returns ref only).
 *  - Visibility & dwell are tracked locally; nothing is sent if the card
 *    was never seen above MIN_VISIBILITY for at least MIN_DWELL_MS.
 *
 * Exposes the live state via ref so the click handler can attach the most
 * recent visibility numbers to the click event.
 */
const MIN_VISIBILITY = 0.5;
const MIN_DWELL_MS = 400;
const THRESHOLDS = [0, 0.25, 0.5, 0.75, 1];

export function useProductImpression(product: Product) {
  const elementRef = useRef<HTMLElement | null>(null);
  const stateRef = useRef<ImpressionState>({
    maxVisibility: 0,
    dwellMs: 0,
    visibleSince: null,
    flushed: false,
  });

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;
    if (typeof window === "undefined") return;
    if (typeof IntersectionObserver === "undefined") return;

    const state = stateRef.current;

    const settleDwell = () => {
      if (state.visibleSince != null) {
        state.dwellMs += performance.now() - state.visibleSince;
        state.visibleSince = null;
      }
    };

    const flush = (reason: "dwell" | "exit" | "unmount" | "pagehide") => {
      settleDwell();
      if (state.flushed) return;
      if (state.maxVisibility < MIN_VISIBILITY) return;
      if (state.dwellMs < MIN_DWELL_MS && reason !== "pagehide") return;
      state.flushed = true;

      const payload: Omit<ProductImpressionEvent, "at"> = {
        productId: String(product.id),
        productSlug: product.slug || `product-${product.id}`,
        productName: product.name,
        price: product.price,
        maxVisibility: Number(state.maxVisibility.toFixed(2)),
        dwellMs: Math.round(state.dwellMs),
        viewportW: window.innerWidth,
        viewportH: window.innerHeight,
      };
      logProductImpression(payload);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio > state.maxVisibility) {
            state.maxVisibility = entry.intersectionRatio;
          }
          if (entry.isIntersecting && entry.intersectionRatio >= MIN_VISIBILITY) {
            if (state.visibleSince == null) {
              state.visibleSince = performance.now();
            }
          } else {
            settleDwell();
            // Flush if user scrolled past after dwelling enough.
            if (
              !state.flushed &&
              state.maxVisibility >= MIN_VISIBILITY &&
              state.dwellMs >= MIN_DWELL_MS
            ) {
              flush("exit");
            }
          }
        }

        // Opportunistic flush once min-dwell is reached, even if still visible.
        if (
          !state.flushed &&
          state.maxVisibility >= MIN_VISIBILITY &&
          state.visibleSince != null
        ) {
          const liveDwell =
            state.dwellMs + (performance.now() - state.visibleSince);
          if (liveDwell >= MIN_DWELL_MS) {
            flush("dwell");
          }
        }
      },
      { threshold: THRESHOLDS },
    );

    observer.observe(node);

    const onPageHide = () => flush("pagehide");
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("visibilitychange", onPageHide);

    return () => {
      observer.disconnect();
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("visibilitychange", onPageHide);
      flush("unmount");
    };
  }, [product.id, product.name, product.price, product.slug]);

  return { elementRef, stateRef };
}
