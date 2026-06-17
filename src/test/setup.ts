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
if (!(globalThis as any).IntersectionObserver) {
  (globalThis as any).IntersectionObserver = NoopObserver as any;
}
if (!(globalThis as any).ResizeObserver) {
  (globalThis as any).ResizeObserver = NoopObserver as any;
}
