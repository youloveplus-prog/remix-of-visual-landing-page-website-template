import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, useMemo, useState } from "react";

// Reuse the same PGRST205 fallback mock as the other Shop tests so we exercise
// the real seed-catalog path without a network round-trip.
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

function Harness() {
  const { data: categories = [] } = useCategories();
  const [active, setActive] = useState("All");

  const items = useMemo(
    () => [{ id: "all", name: "All", slug: "all" }, ...categories],
    [categories],
  );
  const activeId = useMemo(
    () => (active === "All" ? undefined : categories.find((c) => c.name === active)?.id),
    [active, categories],
  );

  const { data: products } = useProducts({
    categoryId: activeId,
    excludeKinds: ["course", "service"],
    limit: 50,
  });

  return (
    <div>
      <CategoryCarousel categories={items} activeCategory={active} onCategoryChange={setActive} />
      {products && products.length > 0 ? (
        <ul data-testid="product-list">
          {products.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      ) : (
        <div
          role="status"
          aria-live="polite"
          data-testid="empty-state"
        >
          No products match your filters.
        </div>
      )}
    </div>
  );
}

function renderHarness() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    createElement(QueryClientProvider, { client: qc }, createElement(Harness)),
  );
}

const waitForReady = async () =>
  waitFor(() => {
    if (!screen.queryByRole("button", { name: /Filter by Books/i })) {
      throw new Error("categories not yet rendered");
    }
  });

const getPill = (name: RegExp) => screen.getByRole("button", { name });

describe("CategoryCarousel — accessibility & keyboard navigation", () => {
  describe("ARIA attributes on category pills", () => {
    it("every pill is a real <button type='button'> with an aria-label", async () => {
      renderHarness();
      await waitForReady();

      for (const label of [
        /Filter by All/i,
        /Filter by Courses/i,
        /Filter by Books/i,
        /Filter by Student Kits/i,
        /Filter by AI Tutor/i,
        /Filter by Gadgets/i,
      ]) {
        const btn = getPill(label);
        expect(btn.tagName).toBe("BUTTON");
        expect(btn.getAttribute("type")).toBe("button");
        expect(btn.getAttribute("aria-label")).toMatch(label);
      }
    });

    it("exactly one pill has aria-pressed='true' at any time", async () => {
      renderHarness();
      await waitForReady();
      const pressed = () =>
        Array.from(document.querySelectorAll("button[aria-pressed='true']"))
          .filter((b) => b.getAttribute("aria-label")?.startsWith("Filter by"));
      expect(pressed()).toHaveLength(1);
      expect(pressed()[0].getAttribute("aria-label")).toMatch(/Filter by All/i);
    });

    it("aria-pressed flips when the user picks a new category", async () => {
      renderHarness();
      await waitForReady();

      const all = getPill(/Filter by All/i);
      const books = getPill(/Filter by Books/i);

      expect(all.getAttribute("aria-pressed")).toBe("true");
      expect(books.getAttribute("aria-pressed")).toBe("false");

      act(() => fireEvent.click(books));

      await waitFor(() => {
        expect(books.getAttribute("aria-pressed")).toBe("true");
        expect(all.getAttribute("aria-pressed")).toBe("false");
      });
    });

    it("the active pill's aria-label is annotated with '(selected)'", async () => {
      renderHarness();
      await waitForReady();
      const books = getPill(/Filter by Books/i);
      act(() => fireEvent.click(books));
      await waitFor(() => {
        expect(books.getAttribute("aria-label")).toBe("Filter by Books (selected)");
      });
    });

    it("the carousel is wrapped in role='group' with an accessible label", async () => {
      renderHarness();
      await waitForReady();
      const group = document.querySelector('[role="group"][aria-label="Product categories"]');
      expect(group).not.toBeNull();
    });

    it("scroll arrows have aria-labels", async () => {
      renderHarness();
      await waitForReady();
      expect(screen.getByRole("button", { name: /scroll categories left/i })).toBeDefined();
      expect(screen.getByRole("button", { name: /scroll categories right/i })).toBeDefined();
    });

    it("decorative icons inside pills are aria-hidden", async () => {
      renderHarness();
      await waitForReady();
      const books = getPill(/Filter by Books/i);
      const svg = books.querySelector("svg");
      expect(svg).not.toBeNull();
      expect(svg!.getAttribute("aria-hidden")).toBe("true");
    });
  });

  describe("keyboard navigation", () => {
    it("category pills are focusable in DOM order (no tabIndex>0)", async () => {
      renderHarness();
      await waitForReady();

      const pills = Array.from(
        document.querySelectorAll<HTMLButtonElement>('button[aria-label^="Filter by"]'),
      );
      expect(pills.length).toBeGreaterThanOrEqual(6);
      for (const p of pills) {
        const t = p.getAttribute("tabindex");
        // null (default 0) or "0" — never positive.
        expect(t === null || t === "0").toBe(true);
      }

      // Sanity: focus actually moves to the first pill.
      pills[0].focus();
      expect(document.activeElement).toBe(pills[0]);
    });

    it("Enter on a focused pill activates the category", async () => {
      renderHarness();
      await waitForReady();
      const books = getPill(/Filter by Books/i);
      books.focus();
      act(() => fireEvent.keyDown(books, { key: "Enter", code: "Enter" }));
      // jsdom doesn't translate keyDown→click for buttons, so simulate the
      // browser's default behaviour explicitly.
      act(() => fireEvent.click(books));
      await waitFor(() => expect(books.getAttribute("aria-pressed")).toBe("true"));
    });

    it("Space on a focused pill activates the category", async () => {
      renderHarness();
      await waitForReady();
      const kits = getPill(/Filter by Student Kits/i);
      kits.focus();
      act(() => fireEvent.keyDown(kits, { key: " ", code: "Space" }));
      act(() => fireEvent.click(kits));
      await waitFor(() => expect(kits.getAttribute("aria-pressed")).toBe("true"));
    });

    it("pills have a visible focus ring class for keyboard users", async () => {
      renderHarness();
      await waitForReady();
      const books = getPill(/Filter by Books/i);
      expect(books.className).toMatch(/focus-visible:ring/);
    });

    it("pills meet the 44px minimum tap-target via min-h-11", async () => {
      renderHarness();
      await waitForReady();
      const books = getPill(/Filter by Books/i);
      expect(books.className).toMatch(/min-h-11/);
    });
  });

  describe("empty state ARIA semantics", () => {
    it("renders role='status' with aria-live='polite' when no products match", async () => {
      renderHarness();
      await waitForReady();

      // Picking 'Courses' on Shop yields zero items because the harness
      // excludes course/service kinds — same call shape as the real page.
      act(() => fireEvent.click(getPill(/Filter by Courses/i)));

      await waitFor(() => {
        const status = screen.getByTestId("empty-state");
        expect(status.getAttribute("role")).toBe("status");
        expect(status.getAttribute("aria-live")).toBe("polite");
        expect(status.textContent).toMatch(/no products/i);
      });
    });

    it("removes the empty state status node once results return", async () => {
      renderHarness();
      await waitForReady();

      act(() => fireEvent.click(getPill(/Filter by Courses/i)));
      await waitFor(() => expect(screen.queryByTestId("empty-state")).not.toBeNull());

      act(() => fireEvent.click(getPill(/Filter by Books/i)));
      await waitFor(() => {
        expect(screen.queryByTestId("empty-state")).toBeNull();
        expect(screen.queryByTestId("product-list")).not.toBeNull();
      });
    });
  });
});
