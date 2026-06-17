// Vitest setup — DOM polyfills only. Skip @testing-library/jest-dom unless a
// test actually needs its matchers (importing it eagerly pulls in lodash and
// breaks tests that don't touch the DOM at all).

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// jsdom doesn't ship IntersectionObserver / ResizeObserver — but Embla and
// other UI libs reference them at mount time. Provide no-op shims so the
// components render without crashing.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
for (const target of [globalThis, typeof window !== "undefined" ? window : null].filter(Boolean) as any[]) {
  if (!target.IntersectionObserver) target.IntersectionObserver = NoopObserver;
  if (!target.ResizeObserver) target.ResizeObserver = NoopObserver;
}
