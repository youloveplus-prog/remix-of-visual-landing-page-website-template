/**
 * Integration tests that validate Row Level Security behavior for:
 *  - Reading a profile (public SELECT — own + others allowed)
 *  - Updating a profile (only auth.uid() = id)
 *  - Creating an order (only auth.uid() = user_id)
 *
 * Strategy: mock @/integrations/supabase/client with a fake PostgREST
 * query builder that simulates RLS based on a configurable currentUserId.
 * If a query would be rejected by the policy, we return the same shape
 * Supabase returns: { data: null, error: { code: '42501' | 'PGRST301', ... } }.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// ---- Fake RLS-aware supabase client ----------------------------------------
type Row = Record<string, any>;
const state = {
  currentUserId: null as string | null,
  profiles: [] as Row[],
  orders: [] as Row[],
  order_items: [] as Row[],
  cart_items: [] as Row[],
  lastOrderInsert: null as Row | null,
};

function rlsError(msg: string) {
  return { data: null, error: { code: "42501", message: msg } };
}

function buildSelectChain(rows: Row[]) {
  const filters: Array<(r: Row) => boolean> = [];
  const chain: any = {
    select: () => chain,
    order: () => chain,
    eq: (col: string, val: any) => {
      filters.push((r) => r[col] === val);
      return chain;
    },
    single: async () => {
      const filtered = rows.filter((r) => filters.every((f) => f(r)));
      if (filtered.length === 0)
        return { data: null, error: { code: "PGRST116", message: "No rows" } };
      return { data: filtered[0], error: null };
    },
    then: (resolve: any) =>
      resolve({ data: rows.filter((r) => filters.every((f) => f(r))), error: null }),
  };
  return chain;
}

const fromImpl = (table: string): any => {
  if (table === "profiles") {
    return {
      select: () => buildSelectChain(state.profiles), // policy: USING (true)
      update: (updates: Row) => {
        const filters: Array<(r: Row) => boolean> = [];
        const chain: any = {
          eq: (col: string, val: any) => {
            filters.push((r) => r[col] === val);
            return chain;
          },
          select: () => chain,
          single: async () => {
            // Policy: USING/CHECK auth.uid() = id
            const match = state.profiles.find((r) => filters.every((f) => f(r)));
            if (!match) return { data: null, error: { code: "PGRST116", message: "No rows" } };
            if (match.id !== state.currentUserId)
              return rlsError("update violates RLS on profiles");
            Object.assign(match, updates);
            return { data: match, error: null };
          },
        };
        return chain;
      },
    };
  }
  if (table === "orders") {
    return {
      insert: (row: Row) => ({
        select: () => ({
          single: async () => {
            // Policy CHECK: auth.uid() = user_id (and must be authenticated)
            if (!state.currentUserId) return rlsError("not authenticated");
            if (row.user_id !== state.currentUserId)
              return rlsError("insert violates RLS on orders");
            const order = { id: "order-1", ...row, created_at: new Date().toISOString() };
            state.orders.push(order);
            state.lastOrderInsert = row;
            return { data: order, error: null };
          },
        }),
      }),
      select: () => buildSelectChain(state.orders),
    };
  }
  if (table === "order_items") {
    return {
      insert: async (rows: Row[]) => {
        if (!state.currentUserId) return rlsError("not authenticated");
        // Policy via parent order ownership; here we approximate by requiring
        // the order_id to belong to an order owned by current user.
        for (const r of rows) {
          const order = state.orders.find((o) => o.id === r.order_id);
          if (!order || order.user_id !== state.currentUserId)
            return rlsError("insert violates RLS on order_items");
        }
        state.order_items.push(...rows);
        return { data: rows, error: null };
      },
    };
  }
  if (table === "cart_items") {
    return {
      delete: () => ({
        eq: async () => {
          state.cart_items = [];
          return { data: null, error: null };
        },
      }),
    };
  }
  return {};
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (t: string) => fromImpl(t),
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

// Mock useAuth so hooks pick up our simulated user.
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: state.currentUserId ? { id: state.currentUserId } : null,
    session: null,
    loading: false,
    isLoggedIn: !!state.currentUserId,
    signOut: () => {},
  }),
}));

// Import AFTER mocks.
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useCreateOrder } from "@/hooks/useOrders";

function wrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
}

beforeEach(() => {
  state.currentUserId = null;
  state.profiles = [
    { id: "user-a", username: "alice", full_name: "Alice" },
    { id: "user-b", username: "bob", full_name: "Bob" },
  ];
  state.orders = [];
  state.order_items = [];
  state.cart_items = [{ id: "c1", user_id: "user-a", product_id: "p1" }];
  state.lastOrderInsert = null;
});

describe("RLS: profiles SELECT (public read)", () => {
  it("authenticated user can read their own profile", async () => {
    state.currentUserId = "user-a";
    const { result } = renderHook(() => useProfile("user-a"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ id: "user-a", username: "alice" });
  });

  it("authenticated user can read OTHER profiles (policy is USING(true))", async () => {
    state.currentUserId = "user-a";
    const { result } = renderHook(() => useProfile("user-b"), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ id: "user-b", username: "bob" });
  });
});

describe("RLS: profiles UPDATE (auth.uid() = id)", () => {
  it("user can update their own profile", async () => {
    state.currentUserId = "user-a";
    const { result } = renderHook(() => useUpdateProfile(), { wrapper: wrapper() });
    await act(async () => {
      await result.current.mutateAsync({ full_name: "Alice Updated" });
    });
    expect(state.profiles.find((p) => p.id === "user-a")?.full_name).toBe("Alice Updated");
  });

  it("user CANNOT update someone else's profile (simulated by switching auth)", async () => {
    // Caller is user-b but we coerce the hook to target user-a's row by
    // pre-pointing the row id mismatch. We simulate by having user-b try to
    // update — useUpdateProfile uses user.id from useAuth, so we manually
    // dispatch an update with a forged id via direct supabase call.
    state.currentUserId = "user-b";
    const { supabase } = await import("@/integrations/supabase/client");
    const res = await supabase
      .from("profiles")
      .update({ full_name: "hacked" })
      .eq("id", "user-a")
      .select()
      .single();
    expect(res.error).toBeTruthy();
    expect(res.error?.code).toBe("42501");
    expect(state.profiles.find((p) => p.id === "user-a")?.full_name).toBe("Alice");
  });

  it("unauthenticated update is rejected by the hook", async () => {
    state.currentUserId = null;
    const { result } = renderHook(() => useUpdateProfile(), { wrapper: wrapper() });
    await expect(
      result.current.mutateAsync({ full_name: "nope" }),
    ).rejects.toThrow(/Not authenticated/);
  });
});

describe("RLS: orders INSERT (auth.uid() = user_id)", () => {
  it("authenticated user creates an order scoped to their own user_id", async () => {
    state.currentUserId = "user-a";
    const { result } = renderHook(() => useCreateOrder(), { wrapper: wrapper() });
    await act(async () => {
      await result.current.mutateAsync({
        paymentMethod: "card",
        shippingAddress: { line1: "x" },
        items: [
          { id: "ci1", product_id: "p1", quantity: 2, products: { id: "p1", price: 10, name: "P" } },
        ],
      });
    });
    expect(state.lastOrderInsert?.user_id).toBe("user-a");
    expect(state.orders).toHaveLength(1);
    expect(state.order_items).toHaveLength(1);
  });

  it("inserting an order with a forged user_id is blocked by RLS", async () => {
    state.currentUserId = "user-a";
    const { supabase } = await import("@/integrations/supabase/client");
    const res = await supabase
      .from("orders")
      .insert({ user_id: "user-b", total: 0, payment_method: "card" })
      .select()
      .single();
    expect(res.error).toBeTruthy();
    expect(res.error?.code).toBe("42501");
    expect(state.orders).toHaveLength(0);
  });

  it("unauthenticated create is rejected", async () => {
    state.currentUserId = null;
    const { result } = renderHook(() => useCreateOrder(), { wrapper: wrapper() });
    await expect(
      result.current.mutateAsync({
        paymentMethod: "card",
        shippingAddress: {},
        items: [],
      }),
    ).rejects.toThrow(/Not authenticated/);
  });
});
