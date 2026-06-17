import { supabase } from "@/integrations/supabase/client";

export interface ProductClickEvent {
  /** Product database id. */
  productId: string;
  /** Product URL slug. */
  productSlug: string;
  /** Product display name. */
  productName: string;
  /** Product price at time of click. */
  price?: number;
  /** ISO timestamp captured at click time. */
  at: string;
  /** Max visibility (0–1) reached before the click, if observed. */
  maxVisibility?: number;
  /** Total ms the card was visible before the click, if observed. */
  dwellMs?: number;
}

export interface ProductImpressionEvent {
  productId: string;
  productSlug: string;
  productName: string;
  price?: number;
  /** Max visibility (0–1) reached during the impression. */
  maxVisibility: number;
  /** Total ms the card was visible. */
  dwellMs: number;
  /** Viewport size at flush time. */
  viewportW?: number;
  viewportH?: number;
  at: string;
}

export type ProductClickLogger = (event: ProductClickEvent) => void;
export type ProductImpressionLogger = (event: ProductImpressionEvent) => void;

const defaultClickLogger: ProductClickLogger = (event) => {
  if (
    typeof window !== "undefined" &&
    typeof window.dispatchEvent === "function"
  ) {
    try {
      window.dispatchEvent(
        new CustomEvent("asikon:product-click", { detail: event }),
      );
    } catch {
      /* CustomEvent not available */
    }
  }

  if (typeof console !== "undefined") {
    // eslint-disable-next-line no-console
    console.info("[analytics] product-click", event);
  }

  // Fire-and-forget Supabase insert — never block navigation.
  if (typeof supabase !== "undefined") {
    try {
      supabase
        .from("product_clicks")
        .insert({
          product_id: event.productId,
          product_slug: event.productSlug,
          product_name: event.productName,
          price: event.price ?? null,
          clicked_at: event.at,
        })
        .then(({ error }) => {
          if (error && import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn("[analytics] product-click insert failed", error);
          }
        });
    } catch {
      /* network/client not ready — silently drop */
    }
  }
};

const defaultImpressionLogger: ProductImpressionLogger = (event) => {
  if (
    typeof window !== "undefined" &&
    typeof window.dispatchEvent === "function"
  ) {
    try {
      window.dispatchEvent(
        new CustomEvent("asikon:product-impression", { detail: event }),
      );
    } catch {
      /* CustomEvent not available */
    }
  }

  if (import.meta.env.DEV && typeof console !== "undefined") {
    // eslint-disable-next-line no-console
    console.debug("[analytics] product-impression", event);
  }

  if (typeof supabase !== "undefined") {
    try {
      supabase
        .from("product_impressions")
        .insert({
          product_id: event.productId,
          product_slug: event.productSlug,
          product_name: event.productName,
          price: event.price ?? null,
          max_visibility: event.maxVisibility,
          dwell_ms: event.dwellMs,
          viewport_w: event.viewportW ?? null,
          viewport_h: event.viewportH ?? null,
          observed_at: event.at,
        })
        .then(({ error }) => {
          if (error && import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.warn("[analytics] product-impression insert failed", error);
          }
        });
    } catch {
      /* silently drop */
    }
  }
};

let activeClickLogger: ProductClickLogger = defaultClickLogger;
let activeImpressionLogger: ProductImpressionLogger = defaultImpressionLogger;

/** Override the click logger (tests only — call __resetProductClickLogger after). */
export function __setProductClickLogger(fn: ProductClickLogger): void {
  activeClickLogger = fn;
}
export function __resetProductClickLogger(): void {
  activeClickLogger = defaultClickLogger;
}
export function __setProductImpressionLogger(
  fn: ProductImpressionLogger,
): void {
  activeImpressionLogger = fn;
}
export function __resetProductImpressionLogger(): void {
  activeImpressionLogger = defaultImpressionLogger;
}

/** Emit a product-click analytics event. */
export function logProductClick(
  event: Omit<ProductClickEvent, "at"> & { at?: string },
): void {
  activeClickLogger({ at: new Date().toISOString(), ...event });
}

/** Emit a product-impression analytics event. */
export function logProductImpression(
  event: Omit<ProductImpressionEvent, "at"> & { at?: string },
): void {
  activeImpressionLogger({ at: new Date().toISOString(), ...event });
}
