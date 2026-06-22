import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { FeaturedEventCard } from "@/components/resources/FeaturedEventCard";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import { RESOURCES, getResourceBySlug } from "@/data/resources";

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Resources page building blocks", () => {
  it("FeaturedEventCard renders a live countdown timer + CTA", () => {
    wrap(
      <FeaturedEventCard
        title="The Asikon Live Summit"
        date="Coming up July 9th"
        target="2099-07-09T15:00:00Z"
        description="A free 90-minute session."
        ctaHref="/auth"
      />,
    );
    expect(screen.getByRole("timer")).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /asikon live summit/i }),
    ).toBeTruthy();
    expect(screen.getByRole("link", { name: /secure your free seat/i })).toBeTruthy();
  });

  it("ResourceCard links to the slug-scoped detail route", () => {
    const r = RESOURCES[0];
    wrap(<ResourceCard resource={r} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe(`/resources/${r.slug}`);
    expect(screen.getByText(r.title)).toBeTruthy();
  });

  it("ResourceGrid renders one card per resource and an empty state when filtered out", () => {
    wrap(<ResourceGrid resources={RESOURCES.slice(0, 3)} title="Most recent updates." />);
    expect(screen.getByText("Most recent updates.")).toBeTruthy();
    expect(screen.getAllByRole("link").length).toBe(3);

    wrap(<ResourceGrid resources={[]} />);
    expect(screen.getByText(/no matches/i)).toBeTruthy();
  });

  it("seed data is internally consistent — every trending resource resolves by slug", () => {
    const trending = RESOURCES.filter((r) => r.trending);
    expect(trending.length).toBeGreaterThan(0);
    for (const r of trending) {
      expect(getResourceBySlug(r.slug)).toBeDefined();
    }
  });
});
