import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";

// Force the seed-catalog fallback by making every Supabase query resolve with
// the "missing table" error code PostgREST returns when `public.products`
// hasn't been provisioned. This mirrors the real network behaviour we see in
// the dev console: `{ code: "PGRST205", message: "Could not find the table…" }`.
vi.mock("@/integrations/supabase/client", () => {
  const missing = { data: null, error: { code: "PGRST205", message: "Could not find the table 'public.products' in the schema cache" } };
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

// Silence the dev-only fallback warning so test output stays clean.
beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

import { useProducts } from "@/hooks/useProducts";
import { CATEGORY_KIND_FALLBACK } from "@/hooks/useCategories";
import { mockProducts } from "@/lib/mock-data";

function wrapper({ children }: { children: ReactNode }) {
  // Fresh QueryClient per render to avoid cross-test cache bleed.
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return createElement(QueryClientProvider, { client: qc }, children);
}

async function runUseProducts(opts: Parameters<typeof useProducts>[0]) {
  const { result } = renderHook(() => useProducts(opts), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  return result.current.data ?? [];
}

describe("Shop category filter — fallback seed catalog", () => {
  it("CATEGORY_KIND_FALLBACK maps every fallback category id", () => {
    for (const id of ["c1", "c2", "c3", "c4", "c5", "c6"]) {
      expect(CATEGORY_KIND_FALLBACK[id]).toBeDefined();
      expect(CATEGORY_KIND_FALLBACK[id]!.length).toBeGreaterThan(0);
    }
  });

  it("returns only ebooks when categoryId='c2' (Books)", async () => {
    const data = await runUseProducts({ categoryId: "c2", limit: 50 });
    expect(data.length).toBeGreaterThan(0);
    for (const p of data) expect(p.kind).toBe("ebook");
    // Sanity: at least one ebook exists in the seed catalog.
    expect(mockProducts.some((p) => p.kind === "ebook")).toBe(true);
  });

  it("returns only bundles when categoryId='c3' (Student Kits)", async () => {
    const data = await runUseProducts({ categoryId: "c3", limit: 50 });
    expect(data.length).toBeGreaterThan(0);
    for (const p of data) expect(p.kind).toBe("bundle");
  });

  it("returns only courses when categoryId='c1' WITHOUT Shop's excludeKinds", async () => {
    const data = await runUseProducts({ categoryId: "c1", limit: 50 });
    expect(data.length).toBeGreaterThan(0);
    for (const p of data) expect(p.kind).toBe("course");
  });

  it("returns ZERO items on Shop when categoryId='c1' is intersected with excludeKinds=[course,service]", async () => {
    // This is the storefront's correct behaviour: the Courses category can't
    // resolve to anything inside /shop because /shop hides courses.
    const data = await runUseProducts({
      categoryId: "c1",
      excludeKinds: ["course", "service"],
      limit: 50,
    });
    expect(data).toEqual([]);
  });

  it("returns ZERO items on Shop when categoryId='c5' (AI Tutor → service) is intersected with excludeKinds", async () => {
    const data = await runUseProducts({
      categoryId: "c5",
      excludeKinds: ["course", "service"],
      limit: 50,
    });
    expect(data).toEqual([]);
  });

  it("returns ebooks when categoryId='c2' + excludeKinds=[course,service] (Shop's exact call shape)", async () => {
    const data = await runUseProducts({
      categoryId: "c2",
      excludeKinds: ["course", "service"],
      limit: 50,
    });
    expect(data.length).toBeGreaterThan(0);
    for (const p of data) {
      expect(p.kind).toBe("ebook");
      expect(p.kind).not.toBe("course");
      expect(p.kind).not.toBe("service");
    }
  });

  it("returns the full storefront catalog (no courses/services) when no categoryId is set", async () => {
    const data = await runUseProducts({
      excludeKinds: ["course", "service"],
      limit: 50,
    });
    expect(data.length).toBeGreaterThan(0);
    for (const p of data) {
      expect(p.kind).not.toBe("course");
      expect(p.kind).not.toBe("service");
    }
    // Sanity: at least both ebooks AND bundles are represented.
    expect(data.some((p) => p.kind === "ebook")).toBe(true);
    expect(data.some((p) => p.kind === "bundle")).toBe(true);
  });

  it("ignores an unknown categoryId rather than returning an empty result", async () => {
    const data = await runUseProducts({ categoryId: "c-does-not-exist", limit: 50 });
    // Unknown → no category filter applied → full seed catalog returned.
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(Math.min(50, mockProducts.length));
  });

  it("composes categoryId with price filters", async () => {
    const data = await runUseProducts({
      categoryId: "c3",
      minPrice: 0,
      maxPrice: 9_999_999,
      limit: 50,
    });
    expect(data.length).toBeGreaterThan(0);
    for (const p of data) expect(p.kind).toBe("bundle");
  });

  it("each result returned for a category actually exists in the seed catalog", async () => {
    const data = await runUseProducts({ categoryId: "c2", limit: 50 });
    const ids = new Set(mockProducts.map((p) => p.id));
    for (const p of data) expect(ids.has(p.id)).toBe(true);
  });
});
