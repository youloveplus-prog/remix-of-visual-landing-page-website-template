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
