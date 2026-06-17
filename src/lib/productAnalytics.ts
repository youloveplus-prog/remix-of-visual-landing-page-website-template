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
}

export type ProductClickLogger = (event: ProductClickEvent) => void;

const defaultLogger: ProductClickLogger = (event) => {
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

let activeLogger: ProductClickLogger = defaultLogger;

/** Override the logger (tests only — call resetProductClickLogger() after). */
export function __setProductClickLogger(fn: ProductClickLogger): void {
  activeLogger = fn;
}

/** Restore the default logger. */
export function __resetProductClickLogger(): void {
  activeLogger = defaultLogger;
}

/** Emit a product-click analytics event. */
export function logProductClick(
  event: Omit<ProductClickEvent, "at"> & { at?: string },
): void {
  activeLogger({ at: new Date().toISOString(), ...event });
}
