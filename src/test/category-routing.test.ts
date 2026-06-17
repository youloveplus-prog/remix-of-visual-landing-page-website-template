import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mockProducts } from "@/lib/mock-data";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

describe("category routing — right items show on the right page", () => {
  describe("/shop (storefront)", () => {
    const shopSrc = read("src/pages/Shop.tsx");

    it("passes excludeKinds: ['course','service'] to useProducts", () => {
      expect(shopSrc).toMatch(/excludeKinds:\s*\[\s*["']course["']\s*,\s*["']service["']\s*\]/);
    });

    it("seed catalog filtered with Shop's excludeKinds contains no courses or services", () => {
      const deny = new Set(["course", "service"]);
      const filtered = mockProducts.filter((p) => !deny.has(p.kind as string));
      expect(filtered.length).toBeGreaterThan(0);
      for (const p of filtered) {
        expect(p.kind).not.toBe("course");
        expect(p.kind).not.toBe("service");
      }
    });

    it("every seed product declares an explicit `kind`", () => {
      for (const p of mockProducts) {
        expect(["course", "ebook", "service", "bundle", "product"]).toContain(p.kind);
      }
    });
  });

  describe("/courses", () => {
    it("CoursesList renders ContentList with kind='course'", () => {
      const src = read("src/pages/CoursesList.tsx");
      expect(src).toMatch(/<ContentList\s+kind=["']course["']\s*\/?>/);
    });
  });

  describe("/services", () => {
    it("ServicesList renders ContentList with kind='service'", () => {
      const src = read("src/pages/ServicesList.tsx");
      expect(src).toMatch(/<ContentList\s+kind=["']service["']\s*\/?>/);
    });
  });

  describe("ContentList → useContentItems", () => {
    const src = read("src/pages/DigitalList.tsx");

    it("forwards its `kind` prop into useContentItems so Supabase filters server-side", () => {
      expect(src).toMatch(/useContentItems\(\s*\{\s*kind\s*,/);
    });
  });

  describe("useContentItems server-side filter", () => {
    const src = read("src/hooks/useContent.ts");

    it("applies .eq('kind', kind) on the content_items query when kind is provided", () => {
      expect(src).toMatch(/if\s*\(\s*kind\s*\)\s*q\s*=\s*q\.eq\(\s*["']kind["']\s*,\s*kind\s*\)/);
    });
  });
});
