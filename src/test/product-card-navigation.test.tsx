/**
 * Verifies the ProductCard → /product/<slug> contract:
 *   1. Every card renders a <Link> whose href matches the product's slug
 *      (or the synthesised `product-<id>` fallback when slug is absent).
 *   2. Wishlist + CTA buttons inside the card don't navigate (they
 *      stopPropagation + preventDefault), so the user always lands on the
 *      detail page they expected.
 *   3. Clicking the card actually changes the location to the right slug
 *      — including when the slug is obviously invalid (the route still
 *      resolves; the not-found state is covered by
 *      product-detail-not-found.a11y.test.tsx).
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useParams } from "react-router-dom";
import { createElement } from "react";

// ProductCard pulls in QuickView → cart hooks → currency. Stub the heavy
// dependents so we can render the card in isolation.
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
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/types";

function makeProduct(overrides: Partial<Product> & { id: string; name: string }): Product {
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

/** Renders a card plus a /product/:slug route that echoes the resolved slug. */
function renderCard(product: Product, initial = "/") {
  return render(
    createElement(
      MemoryRouter,
      { initialEntries: [initial] },
      createElement(
        Routes,
        null,
        createElement(Route, {
          path: "/",
          element: createElement(ProductCard, { product }),
        }),
        createElement(Route, {
          path: "/product/:slug",
          element: createElement(SlugEcho),
        }),
      ),
    ),
  );
}

function SlugEcho() {
  const { slug } = useParams<{ slug: string }>();
  const loc = useLocation();
  return createElement(
    "div",
    null,
    createElement("p", { "data-testid": "echoed-slug" }, slug),
    createElement("p", { "data-testid": "echoed-path" }, loc.pathname),
  );
}

describe("ProductCard → /product/:slug navigation", () => {
  it("uses the product's slug when one is present on the row", () => {
    const product = makeProduct({
      id: "abc-123",
      name: "Web Dev Bootcamp",
      // @ts-expect-error — slug exists on the Supabase row even if not on the
      // legacy Product type; the card reads it via `(product as any).slug`.
      slug: "web-dev-bootcamp",
    });
    renderCard(product);
    const link = screen.getByRole("link", { name: /view web dev bootcamp/i });
    expect(link.getAttribute("href")).toBe("/product/web-dev-bootcamp");
  });

  it("falls back to `product-<id>` when no slug is set", () => {
    const product = makeProduct({ id: "42", name: "Atomic Habits" });
    renderCard(product);
    const link = screen.getByRole("link", { name: /view atomic habits/i });
    expect(link.getAttribute("href")).toBe("/product/product-42");
  });

  it("preserves id-shaped slugs verbatim — even when they are obviously invalid", () => {
    // A row with a malformed slug must still produce a navigable URL; the
    // not-found state on ProductDetail handles the empty result.
    const product = makeProduct({
      id: "999",
      name: "Broken Slug Product",
      // @ts-expect-error — see note above
      slug: "this-slug-does-not-exist",
    });
    renderCard(product);
    const link = screen.getByRole("link", { name: /view broken slug product/i });
    expect(link.getAttribute("href")).toBe("/product/this-slug-does-not-exist");
  });

  it("clicking the card navigates to the slug-scoped detail route", () => {
    const product = makeProduct({
      id: "7",
      name: "Deep Learning",
      // @ts-expect-error — see note above
      slug: "deep-learning",
    });
    renderCard(product);
    const link = screen.getByRole("link", { name: /view deep learning/i });
    fireEvent.click(link);
    expect(screen.getByTestId("echoed-slug").textContent).toBe("deep-learning");
    expect(screen.getByTestId("echoed-path").textContent).toBe("/product/deep-learning");
  });

  it("wishlist button does NOT navigate (preventDefault + stopPropagation)", () => {
    const product = makeProduct({ id: "3", name: "Hardcover Book" });
    renderCard(product);
    const wishlist = screen.getByRole("button", { name: /add to wishlist/i });
    fireEvent.click(wishlist);
    // No SlugEcho means we're still on "/" — the link wasn't followed.
    expect(screen.queryByTestId("echoed-slug")).toBeNull();
    // And the button flipped to the pressed state.
    expect(screen.getByRole("button", { name: /remove from wishlist/i })).toBeTruthy();
  });

  it("CTA button (quick view) does NOT navigate — opens the dialog instead", () => {
    const product = makeProduct({ id: "5", name: "Prompt Library" });
    renderCard(product);
    // The CTA's accessible name starts with the verb (View / Enroll / etc.)
    // and ends with the product name. Match by the trailing product name to
    // stay resilient to copy tweaks in getProductCta.
    const link = screen.getByRole("link", { name: /view prompt library/i });
    const cta = within(link).getAllByRole("button").find(
      (b) => /prompt library$/i.test(b.getAttribute("aria-label") ?? ""),
    );
    expect(cta).toBeDefined();
    fireEvent.click(cta!);
    expect(screen.queryByTestId("echoed-slug")).toBeNull();
  });

  it("renders distinct hrefs for a grid of products — no cross-wiring", () => {
    const products = [
      makeProduct({ id: "1", name: "Course One" }),
      makeProduct({ id: "2", name: "Course Two" }),
      makeProduct({ id: "3", name: "Course Three" }),
    ];
    render(
      createElement(
        MemoryRouter,
        { initialEntries: ["/"] },
        ...products.map((p) =>
          createElement(ProductCard, { key: p.id, product: p }),
        ),
      ),
    );
    const links = screen.getAllByRole("link", { name: /view course/i });
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toEqual([
      "/product/product-1",
      "/product/product-2",
      "/product/product-3",
    ]);
    // Sanity: all three are unique.
    expect(new Set(hrefs).size).toBe(3);
  });
});
