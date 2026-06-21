import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveContentRoute } from "@/lib/contentRouting";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

describe("deep-link content-type guards", () => {
  describe("resolveContentRoute() helper", () => {
    it("returns null while the item is still loading (no premature redirect)", () => {
      expect(resolveContentRoute("course", undefined, "anything")).toBeNull();
      expect(resolveContentRoute("content", null, "anything")).toBeNull();
      expect(resolveContentRoute("product", undefined, "anything")).toBeNull();
    });

    it("returns null when slug is empty", () => {
      expect(resolveContentRoute("course", "course", "")).toBeNull();
    });

    describe("/courses/:slug accepts only courses", () => {
      it("renders when kind === 'course'", () => {
        expect(resolveContentRoute("course", "course", "x")).toBeNull();
      });
      it("redirects a service slug to /content/:slug", () => {
        expect(resolveContentRoute("course", "service", "yoga-1on1")).toBe("/content/yoga-1on1");
      });
      it("redirects a digital slug to /content/:slug", () => {
        expect(resolveContentRoute("course", "digital", "notion-pack")).toBe("/content/notion-pack");
      });
      it("redirects a storefront SKU to /product/:slug", () => {
        expect(resolveContentRoute("course", "bundle", "starter-kit")).toBe("/product/starter-kit");
        expect(resolveContentRoute("course", "ebook", "react-book")).toBe("/product/react-book");
        expect(resolveContentRoute("course", "product", "sticker")).toBe("/product/sticker");
      });
    });

    describe("/content/:slug accepts only digital + service", () => {
      it("renders for digital", () => {
        expect(resolveContentRoute("content", "digital", "x")).toBeNull();
      });
      it("renders for service", () => {
        expect(resolveContentRoute("content", "service", "x")).toBeNull();
      });
      it("redirects a course slug to /courses/:slug", () => {
        expect(resolveContentRoute("content", "course", "react-101")).toBe("/courses/react-101");
      });
      it("redirects storefront SKUs to /product/:slug", () => {
        expect(resolveContentRoute("content", "bundle", "kit")).toBe("/product/kit");
        expect(resolveContentRoute("content", "ebook", "book")).toBe("/product/book");
      });
    });

    describe("/product/:slug accepts only storefront SKUs", () => {
      it("renders for ebook / bundle / product kinds", () => {
        expect(resolveContentRoute("product", "ebook", "x")).toBeNull();
        expect(resolveContentRoute("product", "bundle", "x")).toBeNull();
        expect(resolveContentRoute("product", "product", "x")).toBeNull();
      });
      it("redirects a course slug to /courses/:slug", () => {
        expect(resolveContentRoute("product", "course", "ml-bootcamp")).toBe("/courses/ml-bootcamp");
      });
      it("redirects a service slug to /content/:slug", () => {
        expect(resolveContentRoute("product", "service", "design-review")).toBe("/content/design-review");
      });
    });

    it("never returns the same path it was called on (no redirect loops)", () => {
      const cases: Array<["course" | "content" | "product", string]> = [
        ["course", "course"],
        ["content", "digital"],
        ["content", "service"],
        ["product", "ebook"],
        ["product", "bundle"],
        ["product", "product"],
      ];
      for (const [route, kind] of cases) {
        expect(resolveContentRoute(route, kind, "slug-abc")).toBeNull();
      }
    });
  });

  describe("each detail page wires the guard into its render path", () => {
    it("CourseDetail calls resolveContentRoute('course', …) and <Navigate replace>s", () => {
      const src = read("src/pages/CourseDetail.tsx");
      expect(src).toMatch(/resolveContentRoute\(\s*["']course["']\s*,\s*item\?\.kind\s*,\s*slug\s*\)/);
      expect(src).toMatch(/<Navigate\s+to=\{redirectTo\}\s+replace\s*\/>/);
    });

    it("ContentDetail calls resolveContentRoute('content', …) and <Navigate replace>s", () => {
      const src = read("src/pages/ContentDetail.tsx");
      expect(src).toMatch(/resolveContentRoute\(\s*["']content["']\s*,\s*item\?\.kind\s*,\s*slug\s*\?\?\s*""\s*\)/);
      expect(src).toMatch(/<Navigate\s+to=\{redirectTo\}\s+replace\s*\/>/);
    });

    it("ProductDetail calls resolveContentRoute('product', …) and <Navigate replace>s", () => {
      const src = read("src/pages/ProductDetail.tsx");
      expect(src).toMatch(/resolveContentRoute\(\s*\n?\s*["']product["']/);
      expect(src).toMatch(/<Navigate\s+to=\{productRedirect\}\s+replace\s*\/>/);
    });

    it("the router actually registers all three guarded routes", () => {
      const src = read("src/App.tsx");
      expect(src).toMatch(/path="\/courses\/:slug"\s+element=\{(?:<ErrorBoundary>)?<CourseDetail\s*\/>/);
      expect(src).toMatch(/path="\/content\/:slug"\s+element=\{(?:<ErrorBoundary>)?<ContentDetail\s*\/>/);
      expect(src).toMatch(/path="\/product\/:slug"\s+element=\{(?:<ErrorBoundary>)?<ProductDetail\s*\/>/);
    });
  });
});
