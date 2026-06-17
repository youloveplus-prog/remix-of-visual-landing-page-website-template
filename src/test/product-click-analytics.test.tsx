import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createElement } from "react";

import {
  logProductClick,
  __setProductClickLogger,
  __resetProductClickLogger,
} from "@/lib/productAnalytics";

// Stub heavy dependents so ProductCard renders in isolation.
vi.mock("@/components/shop/ProductQuickView", () => ({
  ProductQuickView: () => null,
}));
vi.mock("@/lib/currency", () => ({
  Price: ({ amount }: { amount: number }) =>
    createElement("span", null, `৳${amount}`),
}));
vi.mock("@/components/ui/smart-image", () => ({
  SmartImage: ({ src, alt }: { src: string; alt: string }) =>
    createElement("img", { src, alt }),
}));

beforeEach(() => {
  __resetProductClickLogger();
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  __resetProductClickLogger();
});

import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/types";

function makeProduct(
  overrides: Partial<Product> & { id: string; name: string },
): Product {
  return {
    id: overrides.id,
    name: overrides.name,
    kind: overrides.kind ?? "course",
    price: overrides.price ?? 49,
    image: overrides.image ?? "/seed/course-ai-ml.jpg",
    brand: overrides.brand ?? "Asikon Academy",
    rating: overrides.rating ?? 4.8,
    reviews: overrides.reviews ?? 100,
    ...overrides,
  } as Product;
}

describe("ProductCard click analytics", () => {
  it("dispatches a CustomEvent with product details when the card is clicked", () => {
    const listener = vi.fn();
    window.addEventListener("asikon:product-click", listener as any);

    logProductClick({
      productId: "p-123",
      productSlug: "ai-bootcamp",
      productName: "AI Bootcamp",
      price: 99,
    });

    expect(listener).toHaveBeenCalledOnce();
    const detail = (listener.mock.calls[0][0] as CustomEvent).detail;
    expect(detail.productId).toBe("p-123");
    expect(detail.productSlug).toBe("ai-bootcamp");
    expect(detail.productName).toBe("AI Bootcamp");
    expect(detail.price).toBe(99);
    expect(detail.at).toBeTypeOf("string");

    window.removeEventListener("asikon:product-click", listener as any);
  });

  it("ProductCard Link calls logProductClick on click via the override", () => {
    const captured: any[] = [];
    __setProductClickLogger((evt) => captured.push(evt));

    const product = makeProduct({
      id: "7",
      name: "Deep Learning",
      price: 149,
      // @ts-expect-error — slug exists on the Supabase row
      slug: "deep-learning",
    });

    render(
      createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        createElement(
          Routes,
          null,
          createElement(Route, {
            path: "/",
            element: createElement(ProductCard, { product }),
          }),
          createElement(Route, {
            path: "/product/:slug",
            element: createElement("div", { "data-testid": "detail" }, "detail"),
          }),
        ),
      ),
    );

    const link = screen.getByRole("link", { name: /view deep learning/i });
    fireEvent.click(link);

    expect(captured.length).toBe(1);
    expect(captured[0].productId).toBe("7");
    expect(captured[0].productSlug).toBe("deep-learning");
    expect(captured[0].productName).toBe("Deep Learning");
    expect(captured[0].price).toBe(149);
    expect(captured[0].at).toBeTypeOf("string");
  });

  it("uses the product-id fallback slug when no explicit slug is present", () => {
    const captured: any[] = [];
    __setProductClickLogger((evt) => captured.push(evt));

    const product = makeProduct({ id: "42", name: "Atomic Habits", price: 29 });

    render(
      createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        createElement(
          Routes,
          null,
          createElement(Route, {
            path: "/",
            element: createElement(ProductCard, { product }),
          }),
          createElement(Route, {
            path: "/product/:slug",
            element: createElement("div", { "data-testid": "detail" }, "detail"),
          }),
        ),
      ),
    );

    const link = screen.getByRole("link", { name: /view atomic habits/i });
    fireEvent.click(link);

    expect(captured.length).toBe(1);
    expect(captured[0].productSlug).toBe("product-42");
  });

  it("does NOT fire analytics when the wishlist button is clicked", () => {
    const captured: any[] = [];
    __setProductClickLogger((evt) => captured.push(evt));

    const product = makeProduct({ id: "3", name: "Hardcover Book" });

    render(
      createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        createElement(ProductCard, { product }),
      ),
    );

    const wishlist = screen.getByRole("button", { name: /add to wishlist/i });
    fireEvent.click(wishlist);

    expect(captured.length).toBe(0);
  });

  it("does NOT fire analytics when the CTA (quick view) button is clicked", () => {
    const captured: any[] = [];
    __setProductClickLogger((evt) => captured.push(evt));

    const product = makeProduct({ id: "5", name: "Prompt Library" });

    render(
      createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        createElement(ProductCard, { product }),
      ),
    );

    const link = screen.getByRole("link", { name: /view prompt library/i });
    const cta = screen
      .getAllByRole("button")
      .find((b) =>
        /prompt library$/i.test(b.getAttribute("aria-label") ?? ""),
      );
    expect(cta).toBeDefined();
    fireEvent.click(cta!);

    expect(captured.length).toBe(0);
  });
});
