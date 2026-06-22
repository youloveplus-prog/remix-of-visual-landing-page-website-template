import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Resources from "@/pages/Resources";
import ResourceDetail from "@/pages/ResourceDetail";
import { RESOURCES } from "@/data/resources";

function renderAt(path: string) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <HelmetProvider>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:slug" element={<ResourceDetail />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    </QueryClientProvider>,
  );
}

describe("Resources page", () => {
  it("renders the featured event card and at least one trending resource card", () => {
    renderAt("/resources");
    expect(screen.getByRole("timer")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /clear search/i }) ||
        screen.getByPlaceholderText(/search resources/i),
    ).toBeTruthy();
    expect(screen.getByPlaceholderText(/search resources/i)).toBeTruthy();
    expect(screen.getByText(RESOURCES[0].title)).toBeTruthy();
  });

  it("resolves a known resource slug on the detail route", () => {
    const sample = RESOURCES[0];
    renderAt(`/resources/${sample.slug}`);
    expect(screen.getByRole("heading", { level: 1, name: sample.title })).toBeTruthy();
    expect(screen.getByText(/published/i)).toBeTruthy();
  });
});
