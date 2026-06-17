import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { createElement } from "react";
import {
  __resetKindMismatchLogger,
  __setKindMismatchLogger,
  logKindMismatchRedirect,
  type KindMismatchEvent,
} from "@/lib/contentRouting";
import { useKindMismatchTelemetry } from "@/lib/useKindMismatchTelemetry";

describe("kind-mismatch redirect telemetry", () => {
  let events: KindMismatchEvent[] = [];

  beforeEach(() => {
    events = [];
    __setKindMismatchLogger((e) => events.push(e));
  });

  afterEach(() => {
    __resetKindMismatchLogger();
  });

  describe("logKindMismatchRedirect()", () => {
    it("forwards the event to the active logger and stamps `at`", () => {
      logKindMismatchRedirect({ from: "course", to: "/content/x", kind: "service", slug: "x" });
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        from: "course",
        to: "/content/x",
        kind: "service",
        slug: "x",
      });
      expect(typeof events[0].at).toBe("string");
      expect(Number.isNaN(Date.parse(events[0].at))).toBe(false);
    });

    it("respects an explicit `at` override", () => {
      logKindMismatchRedirect({
        from: "product",
        to: "/courses/abc",
        kind: "course",
        slug: "abc",
        at: "2026-01-01T00:00:00.000Z",
      });
      expect(events[0].at).toBe("2026-01-01T00:00:00.000Z");
    });
  });

  describe("useKindMismatchTelemetry() hook", () => {
    const wrap = (children: React.ReactNode) =>
      createElement(MemoryRouter, null, children);

    it("does NOT fire while data is still loading (kind undefined)", () => {
      renderHook(
        () => useKindMismatchTelemetry("course", null, undefined, "react-101"),
        { wrapper: ({ children }) => wrap(children) as any },
      );
      expect(events).toHaveLength(0);
    });

    it("does NOT fire when the route matches the kind (no redirect)", () => {
      renderHook(
        () => useKindMismatchTelemetry("course", null, "course", "react-101"),
        { wrapper: ({ children }) => wrap(children) as any },
      );
      expect(events).toHaveLength(0);
    });

    it("fires exactly once per navigation when a redirect is computed", () => {
      renderHook(
        () =>
          useKindMismatchTelemetry(
            "course",
            "/content/yoga-1on1",
            "service",
            "yoga-1on1",
          ),
        { wrapper: ({ children }) => wrap(children) as any },
      );
      expect(events).toHaveLength(1);
      expect(events[0]).toMatchObject({
        from: "course",
        to: "/content/yoga-1on1",
        kind: "service",
        slug: "yoga-1on1",
      });
    });

    it("does not double-fire across re-renders with the same slug+target", () => {
      const { rerender } = renderHook(
        ({ slug }) =>
          useKindMismatchTelemetry("content", "/courses/" + slug, "course", slug),
        {
          initialProps: { slug: "react-101" },
          wrapper: ({ children }) => wrap(children) as any,
        },
      );
      rerender({ slug: "react-101" });
      rerender({ slug: "react-101" });
      expect(events).toHaveLength(1);
    });

    it("fires again when the user navigates to a different mismatched slug", () => {
      const { rerender } = renderHook(
        ({ slug }) =>
          useKindMismatchTelemetry("content", "/courses/" + slug, "course", slug),
        {
          initialProps: { slug: "react-101" },
          wrapper: ({ children }) => wrap(children) as any,
        },
      );
      rerender({ slug: "ml-bootcamp" });
      expect(events).toHaveLength(2);
      expect(events.map((e) => e.slug)).toEqual(["react-101", "ml-bootcamp"]);
    });

    it("default logger also dispatches a CustomEvent on window", () => {
      __resetKindMismatchLogger();
      const spy = vi.fn();
      window.addEventListener("asikon:kind-mismatch-redirect", spy as EventListener);
      try {
        logKindMismatchRedirect({
          from: "product",
          to: "/courses/x",
          kind: "course",
          slug: "x",
        });
        expect(spy).toHaveBeenCalledTimes(1);
        const ev = spy.mock.calls[0][0] as CustomEvent<KindMismatchEvent>;
        expect(ev.detail).toMatchObject({ from: "product", to: "/courses/x", kind: "course", slug: "x" });
      } finally {
        window.removeEventListener("asikon:kind-mismatch-redirect", spy as EventListener);
      }
    });
  });

  describe("static wiring — each detail page invokes the hook", () => {
    const read = (p: string) =>
      require("node:fs").readFileSync(require("node:path").resolve(process.cwd(), p), "utf8");

    it("CourseDetail calls useKindMismatchTelemetry('course', …)", () => {
      const src = read("src/pages/CourseDetail.tsx");
      expect(src).toMatch(/useKindMismatchTelemetry\(\s*["']course["']\s*,\s*redirectTo\s*,\s*item\?\.kind\s*,\s*slug\s*\)/);
    });

    it("ContentDetail calls useKindMismatchTelemetry('content', …)", () => {
      const src = read("src/pages/ContentDetail.tsx");
      expect(src).toMatch(/useKindMismatchTelemetry\(\s*["']content["']\s*,\s*redirectTo\s*,\s*item\?\.kind\s*,\s*slug\s*\?\?\s*""\s*\)/);
    });

    it("ProductDetail calls useKindMismatchTelemetry('product', …)", () => {
      const src = read("src/pages/ProductDetail.tsx");
      expect(src).toMatch(/useKindMismatchTelemetry\(\s*["']product["']\s*,\s*productRedirect\s*,/);
    });
  });
});

// Silence unused-import lint for render — kept for future expansion.
void render;
