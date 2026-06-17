import { describe, it, expect } from "vitest";
import { getProductCta } from "./productCta";

describe("getProductCta", () => {
  it.each([
    ["courses", "Enroll now", "course"],
    ["books", "Read now", "book"],
    ["prompts", "Download pack", "prompt"],
    ["ai-tutor", "Start chatting", "ai-tutor"],
    ["kits", "Get the kit", "kit"],
    ["gadgets", "Get blueprint", "gadget"],
    ["mentorship", "Book a mentor", "mentorship"],
  ])("maps slug %s → %s", (slug, label, kind) => {
    const cta = getProductCta({ categorySlug: slug });
    expect(cta.kind).toBe(kind);
    expect(cta.primaryLabel).toBe(label);
  });

  it("reads slug from nested category object", () => {
    expect(getProductCta({ category: { slug: "books" } }).kind).toBe("book");
  });

  it("falls back to ProductKind when no slug is present", () => {
    expect(getProductCta({ kind: "course" }).kind).toBe("course");
    expect(getProductCta({ kind: "ebook" }).kind).toBe("book");
  });

  it("falls back to category name keyword", () => {
    expect(getProductCta({ category: "AI Tutor" }).kind).toBe("ai-tutor");
    expect(getProductCta({ categoryName: "Books & Guides" }).kind).toBe("book");
  });

  it("falls back to product name keyword", () => {
    expect(getProductCta({ name: "Python Bootcamp" }).kind).toBe("course");
    expect(getProductCta({ name: "Prompt Pack v2" }).kind).toBe("prompt");
  });

  it("returns generic when nothing matches", () => {
    const cta = getProductCta({ name: "Mystery item" });
    expect(cta.kind).toBe("generic");
    expect(cta.primaryLabel).toBe("Get access");
  });

  it("overrides label when the user already owns the item", () => {
    const cta = getProductCta({ categorySlug: "courses" }, { owned: true });
    expect(cta.primaryLabel).toBe("Continue learning");
    expect(cta.kind).toBe("course"); // kind unchanged
    expect(cta.ownedHref).toBe("/learn");
  });

  it("is case-insensitive on slugs", () => {
    expect(getProductCta({ categorySlug: "COURSES" }).kind).toBe("course");
  });
});
