import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createElement, type ReactNode } from "react";

// Force the seed-catalog fallback so we can drive the page deterministically.
vi.mock("@/integrations/supabase/client", () => {
  const missing = {
    data: null,
    error: {
      code: "PGRST205",
      message: "Could not find the table 'public.products' in the schema cache",
    },
  };
  const chain: any = new Proxy(
    {},
    {
      get: (_t, prop) => {
        if (prop === "then") return (resolve: any) => resolve(missing);
        return () => chain;
      },
    },
  );
  return { supabase: { from: () => chain } };
});

// Keep the render lightweight — the empty state is what we're auditing,
// not the surrounding chrome.
vi.mock("@/components/layout/AppLayout", () => ({
  AppLayout: ({ children }: { children: ReactNode }) =>
    createElement("div", { "data-testid": "app-layout" }, children),
}));
vi.mock("@/components/layout/MobilePage", () => ({
  MobilePage: ({ children }: { children: ReactNode }) =>
    createElement("div", { "data-testid": "mobile-page" }, children),
}));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null }),
}));
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));
vi.mock("@/hooks/useCart", () => ({
  useAddToCart: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("@/lib/currency", () => ({
  Price: ({ amount, className }: { amount: number; className?: string }) =>
    createElement("span", { className }, `৳${amount}`),
}));

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

import ProductDetail from "@/pages/ProductDetail";

function renderAt(path: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    createElement(
      HelmetProvider,
      null,
      createElement(
        QueryClientProvider,
        { client: qc },
        createElement(
          MemoryRouter,
          { initialEntries: [path] },
          createElement(
            Routes,
            null,
            createElement(Route, { path: "/product/:slug", element: createElement(ProductDetail) }),
          ),
        ),
      ),
    ),
  );
}

describe("ProductDetail — 'Product not found' a11y", () => {
  it("renders the empty state as a live alert region", async () => {
    renderAt("/product/this-slug-does-not-exist");
    const region = await screen.findByTestId("product-not-found");
    expect(region.tagName.toLowerCase()).toBe("section");
    expect(region.getAttribute("role")).toBe("alert");
    expect(region.getAttribute("aria-live")).toBe("assertive");
  });

  it("links the region to its heading and description via aria-*", async () => {
    renderAt("/product/this-slug-does-not-exist");
    const region = await screen.findByTestId("product-not-found");
    const labelId = region.getAttribute("aria-labelledby");
    const descId = region.getAttribute("aria-describedby");
    expect(labelId).toBeTruthy();
    expect(descId).toBeTruthy();
    const heading = document.getElementById(labelId!);
    const desc = document.getElementById(descId!);
    expect(heading?.tagName.toLowerCase()).toBe("h1");
    expect(heading?.textContent).toMatch(/product not found/i);
    expect(desc?.textContent).toMatch(/removed|out of date/i);
  });

  it("exposes a single H1 so screen-reader users land on it", async () => {
    renderAt("/product/unknown");
    await screen.findByTestId("product-not-found");
    const h1s = document.querySelectorAll("h1");
    expect(h1s.length).toBe(1);
    expect(h1s[0]?.textContent).toMatch(/product not found/i);
  });

  it("groups recovery actions in a labelled <nav> with named links", async () => {
    renderAt("/product/unknown");
    const region = await screen.findByTestId("product-not-found");
    const nav = within(region).getByRole("navigation", { name: /recovery actions/i });
    const back = within(nav).getByRole("link", { name: /back to shop/i });
    const featured = within(nav).getByRole("link", { name: /browse featured/i });
    expect(back.getAttribute("href")).toBe("/shop");
    expect(featured.getAttribute("href")).toContain("/shop");
  });

  it("hides the decorative icon container from assistive tech", async () => {
    renderAt("/product/unknown");
    const region = await screen.findByTestId("product-not-found");
    const hidden = region.querySelector('[aria-hidden="true"]');
    expect(hidden).toBeTruthy();
  });

  it("renders the suggestions strip as a list with accessible link names", async () => {
    renderAt("/product/unknown");
    await screen.findByTestId("product-not-found");
    // featured strip pulls from the seed catalog — wait for at least one item.
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /you might like/i, level: 2 }),
      ).toBeTruthy();
    });
    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      const link = within(item).getByRole("link");
      // aria-label="View <product name>" → never an empty accessible name
      expect(link.getAttribute("aria-label")).toMatch(/^view /i);
    }
  });

  it("marks suggestion thumbnails as decorative (alt='' + aria-hidden)", async () => {
    renderAt("/product/unknown");
    await screen.findByRole("heading", { name: /you might like/i });
    const list = screen.getByRole("list");
    const imgs = list.querySelectorAll("img");
    expect(imgs.length).toBeGreaterThan(0);
    imgs.forEach((img) => {
      expect(img.getAttribute("alt")).toBe("");
      expect(img.getAttribute("aria-hidden")).toBe("true");
    });
  });
});
