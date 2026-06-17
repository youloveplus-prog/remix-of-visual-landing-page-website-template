import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  CommunityRightRail,
  type RightRailData,
  type RightRailFetcher,
} from "./CommunityRightRail";

/**
 * These tests simulate a Supabase-backed fetcher for the right rail.
 * Pattern matches how the real wiring will look:
 *   const fetcher = async () => {
 *     const [c, t, l] = await Promise.all([
 *       supabase.from("creators").select(...),
 *       supabase.from("tags").select(...),
 *       supabase.from("live_sessions").select(...).maybeSingle(),
 *     ]);
 *     if (c.error || t.error || l.error) throw new Error("supabase");
 *     return { creators: c.data, tags: t.data, live: l.data };
 *   };
 *
 * We don't need a real Supabase client — we inject a mocked fetcher
 * that throws to mimic a network/RLS failure, then resolves on retry.
 */

const SUCCESS_DATA: RightRailData = {
  creators: [
    {
      id: "1",
      name: "Asikon Academy",
      username: "asikon_academy",
      avatar: "https://example.com/a.jpg",
      followers: "84k",
    },
  ],
  tags: ["#aitutor", "#python"],
  live: {
    title: "AI Tutor Q&A",
    watching: 132,
    thumbnail: "https://example.com/live.jpg",
  },
};

function renderRail(fetcher: RightRailFetcher) {
  return render(
    <MemoryRouter>
      <CommunityRightRail fetcher={fetcher} />
    </MemoryRouter>,
  );
}

describe("CommunityRightRail — Supabase failure + retry", () => {
  it("shows error UI in every tile when the initial fetch rejects", async () => {
    const fetcher = vi.fn<RightRailFetcher>().mockRejectedValueOnce(
      new Error("supabase: connection reset"),
    );

    const { container } = renderRail(fetcher);

    await waitFor(() => {
      expect(container.querySelectorAll('[role="alert"]').length).toBe(3);
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    const alertText = container.textContent ?? "";
    expect(alertText).toContain("Couldn't load creators.");
    expect(alertText).toContain("Couldn't load trending tags.");
    expect(alertText).toContain("Couldn't load live sessions.");
  });

  it("clicking Retry refetches and swaps in the success UI", async () => {
    const fetcher = vi
      .fn<RightRailFetcher>()
      .mockRejectedValueOnce(new Error("supabase: 500"))
      .mockResolvedValueOnce(SUCCESS_DATA);

    const { container, getAllByRole, getByText } = renderRail(fetcher);

    // 1. Wait for the error state to land.
    await waitFor(() => {
      expect(container.querySelectorAll('[role="alert"]').length).toBe(3);
    });

    // 2. Each error row exposes a Retry button — click any one of them.
    const retryButtons = getAllByRole("button", { name: /retry/i });
    expect(retryButtons.length).toBe(3);
    fireEvent.click(retryButtons[0]);

    // 3. Fetcher is called again.
    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    // 4. Error rows disappear and real content lands in every tile.
    await waitFor(() => {
      expect(container.querySelectorAll('[role="alert"]').length).toBe(0);
    });

    expect(getByText("Asikon Academy")).toBeTruthy();
    expect(getByText("#aitutor")).toBeTruthy();
    expect(getByText("AI Tutor Q&A")).toBeTruthy();
  });

  it("retry recovers cleanly when failure repeats once before succeeding", async () => {
    const fetcher = vi
      .fn<RightRailFetcher>()
      .mockRejectedValueOnce(new Error("first"))
      .mockRejectedValueOnce(new Error("second"))
      .mockResolvedValueOnce(SUCCESS_DATA);

    const { container, getAllByRole, getByText } = renderRail(fetcher);

    await waitFor(() => {
      expect(container.querySelectorAll('[role="alert"]').length).toBe(3);
    });

    // First retry — still failing.
    fireEvent.click(getAllByRole("button", { name: /retry/i })[0]);
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
    await waitFor(() => {
      expect(container.querySelectorAll('[role="alert"]').length).toBe(3);
    });

    // Second retry — succeeds.
    fireEvent.click(getAllByRole("button", { name: /retry/i })[0]);
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(3));
    await waitFor(() => {
      expect(container.querySelectorAll('[role="alert"]').length).toBe(0);
    });
    expect(getByText("Asikon Academy")).toBeTruthy();
  });

  it("renders empty rows (not errors) when fetcher resolves with empty data", async () => {
    const fetcher = vi.fn<RightRailFetcher>().mockResolvedValueOnce({
      creators: [],
      tags: [],
      live: null,
    });

    const { container } = renderRail(fetcher);

    await waitFor(() => {
      // No error rows, but 3 status rows (one empty per tile).
      expect(container.querySelectorAll('[role="alert"]').length).toBe(0);
      expect(container.querySelectorAll('[role="status"]').length).toBe(3);
    });

    const text = container.textContent ?? "";
    expect(text).toContain("No suggestions right now");
    expect(text).toContain("No trending tags yet");
    expect(text).toContain("No one is live right now");
  });
});
