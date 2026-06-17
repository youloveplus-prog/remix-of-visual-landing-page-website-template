import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, useMemo, useState, type ReactNode } from "react";

// Mock Supabase so every query resolves with the "missing table" error and
// every page falls back to the seed catalog — the exact code path the live
// preview is currently exercising.
vi.mock("@/integrations/supabase/client", () => {
  const missing = {
    data: null,
    error: { code: "PGRST205", message: "Could not find the table 'public.products' in the schema cache" },
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

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCarousel } from "@/components/carousels/CategoryCarousel";

/**
 * Minimal harness that mirrors Shop's exact wiring:
 *   CategoryCarousel → setActiveCategory → useProducts({ categoryId, excludeKinds })
 * Renders the resulting product names + the empty state. Keeps the test
 * focused on data flow without dragging in the full AppLayout/SEO/etc tree.
 */
function ShopCategoryHarness() {
  const { data: categories = [] } = useCategories();
  const [activeCategory, setActiveCategory] = useState("All");

  const items = useMemo(
    () => [{ id: "all", name: "All", slug: "all" }, ...categories],
    [categories],
  );

  const activeCategoryId = useMemo(() => {
    if (activeCategory === "All") return undefined;
    return categories.find((c) => c.name === activeCategory)?.id;
  }, [activeCategory, categories]);

  const { data: products, isLoading } = useProducts({
    categoryId: activeCategoryId,
    excludeKinds: ["course", "service"],
    limit: 50,
  });

  return (
    <div>
      <CategoryCarousel
        categories={items}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div data-testid="results-count">{products?.length ?? 0}</div>
      {isLoading ? (
        <p>Loading…</p>
      ) : products && products.length > 0 ? (
        <ul data-testid="product-list">
          {products.map((p) => (
            <li key={p.id} data-kind={p.kind}>{p.name}</li>
          ))}
        </ul>
      ) : (
        <p data-testid="empty-state">No products match your filters.</p>
      )}
    </div>
  );
}

function renderHarness() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    createElement(QueryClientProvider, { client: qc }, createElement(ShopCategoryHarness)),
  );
}

const allKinds = () =>
  Array.from(screen.getByTestId("product-list").querySelectorAll<HTMLLIElement>("li"))
    .map((li) => li.dataset.kind!);

describe("Shop category picker — UI integration with fallback catalog", () => {
  it("renders the full storefront (no courses/services) on first load with 'All' active", async () => {
    renderHarness();
    await waitFor(() => expect(screen.queryByTestId("product-list")).toBeInTheDocument());
    const kinds = allKinds();
    expect(kinds.length).toBeGreaterThan(0);
    for (const k of kinds) expect(["course", "service"]).not.toContain(k);
    expect(kinds.some((k) => k === "ebook")).toBe(true);
    expect(kinds.some((k) => k === "bundle")).toBe(true);
  });

  it("clicking 'Books' narrows the list to ebooks only", async () => {
    const user = userEvent.setup();
    renderHarness();
    await waitFor(() => expect(screen.queryByTestId("product-list")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /books/i }));

    await waitFor(() => {
      const kinds = allKinds();
      expect(kinds.length).toBeGreaterThan(0);
      for (const k of kinds) expect(k).toBe("ebook");
    });
  });

  it("clicking 'Student Kits' narrows the list to bundles only", async () => {
    const user = userEvent.setup();
    renderHarness();
    await waitFor(() => expect(screen.queryByTestId("product-list")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /student kits/i }));

    await waitFor(() => {
      const kinds = allKinds();
      expect(kinds.length).toBeGreaterThan(0);
      for (const k of kinds) expect(k).toBe("bundle");
    });
  });

  it("clicking 'Courses' on Shop shows the empty state (kind excluded by Shop)", async () => {
    const user = userEvent.setup();
    renderHarness();
    await waitFor(() => expect(screen.queryByTestId("product-list")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /^courses$/i }));

    await waitFor(() => {
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.queryByTestId("product-list")).not.toBeInTheDocument();
      expect(screen.getByTestId("results-count")).toHaveTextContent("0");
    });
  });

  it("clicking 'AI Tutor' on Shop also shows the empty state (service kind excluded)", async () => {
    const user = userEvent.setup();
    renderHarness();
    await waitFor(() => expect(screen.queryByTestId("product-list")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /ai tutor/i }));

    await waitFor(() => {
      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });
  });

  it("switching back from an empty category to 'All' restores the full list", async () => {
    const user = userEvent.setup();
    renderHarness();
    await waitFor(() => expect(screen.queryByTestId("product-list")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /^courses$/i }));
    await waitFor(() => expect(screen.getByTestId("empty-state")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /^all$/i }));
    await waitFor(() => {
      const list = screen.getByTestId("product-list");
      expect(within(list).getAllByRole("listitem").length).toBeGreaterThan(1);
    });
  });

  it("switching from 'Books' directly to 'Student Kits' replaces (not appends) the list", async () => {
    const user = userEvent.setup();
    renderHarness();
    await waitFor(() => expect(screen.queryByTestId("product-list")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /books/i }));
    await waitFor(() => {
      const kinds = allKinds();
      expect(kinds.every((k) => k === "ebook")).toBe(true);
    });

    await user.click(screen.getByRole("button", { name: /student kits/i }));
    await waitFor(() => {
      const kinds = allKinds();
      expect(kinds.length).toBeGreaterThan(0);
      expect(kinds.every((k) => k === "bundle")).toBe(true);
      // Importantly: no ebooks leaked through after the switch.
      expect(kinds.some((k) => k === "ebook")).toBe(false);
    });
  });

  it("the active category button is visually marked when selected", async () => {
    const user = userEvent.setup();
    renderHarness();
    await waitFor(() => expect(screen.queryByTestId("product-list")).toBeInTheDocument());

    const booksBtn = screen.getByRole("button", { name: /books/i });
    expect(booksBtn.className).not.toMatch(/gradient-primary/);

    await user.click(booksBtn);
    await waitFor(() => expect(booksBtn.className).toMatch(/gradient-primary/));
  });
});
