import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (rel: string) =>
  readFileSync(resolve(process.cwd(), rel), "utf8");

/**
 * Smoke tests verifying that every guarded route in App.tsx is wrapped in
 * <ErrorBoundary> and that the boundary actually catches render-time errors
 * so a broken page never produces a blank screen.
 */
describe("ErrorBoundary route smoke tests", () => {
  it("App.tsx wraps every primary route element in <ErrorBoundary>", () => {
    const src = read("src/App.tsx");
    const routePaths = [
      "/",
      "/shop",
      "/cart",
      "/profile",
      "/auth",
      "/courses/:slug",
      "/content/:slug",
      "/product/:slug",
    ];
    for (const path of routePaths) {
      const escaped = path.replace(/[/:]/g, (c) => `\\${c}`);
      const re = new RegExp(
        `path="${escaped}"\\s+element=\\{<ErrorBoundary>`,
      );
      expect(src, `expected ${path} to be wrapped in <ErrorBoundary>`).toMatch(re);
    }
  });

  it("ErrorBoundary renders its children when no error is thrown", () => {
    render(
      <MemoryRouter initialEntries={["/ok"]}>
        <Routes>
          <Route
            path="/ok"
            element={
              <ErrorBoundary>
                <div>route-content-ok</div>
              </ErrorBoundary>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("route-content-ok")).toBeInTheDocument();
  });

  it("ErrorBoundary catches a render-time crash and shows the fallback UI", () => {
    const Boom = (): JSX.Element => {
      throw new Error("kaboom");
    };
    // Silence the expected React error log for this test only.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={["/boom"]}>
        <Routes>
          <Route
            path="/boom"
            element={
              <ErrorBoundary>
                <Boom />
              </ErrorBoundary>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reload/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go home/i })).toBeInTheDocument();
    spy.mockRestore();
  });
});
