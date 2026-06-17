import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";

// Mirror the live preview: PostgREST returns PGRST205 because the products
// table isn't provisioned. The detail-page hook must then read from the
// seeded fallback catalog so /product/<slug> doesn't dead-end.
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

beforeEach(() => {
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

import { useProduct } from "@/hooks/useProducts";
import { mockProducts } from "@/lib/mock-data";

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return createElement(QueryClientProvider, { client: qc }, children);
}

async function run(slug: string) {
  const { result } = renderHook(() => useProduct(slug), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  return result.current.data;
}

describe("useProduct — seed catalog fallback", () => {
  it("resolves by fallback slug pattern `product-<id>`", async () => {
    const seed = mockProducts[0];
    const data = await run(`product-${seed.id}`);
    expect(data).toBeTruthy();
    expect(data!.id).toBe(seed.id);
    expect(data!.name).toBe(seed.name);
  });

  it("resolves by bare id as a safety net for older bookmarks", async () => {
    const seed = mockProducts[2];
    const data = await run(seed.id);
    expect(data).toBeTruthy();
    expect(data!.id).toBe(seed.id);
  });

  it("returns null for unknown slugs (true 'not found' state)", async () => {
    const data = await run("does-not-exist-anywhere");
    expect(data).toBeNull();
  });

  it("carries through the `kind` field so the page can branch UI", async () => {
    const seed = mockProducts.find((p) => p.kind) ?? mockProducts[0];
    const data = await run(`product-${seed.id}`);
    expect(data).toBeTruthy();
    expect((data as any).kind).toBeDefined();
  });
});
