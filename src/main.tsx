// Display/body fonts (Satoshi, Sentient, Edensor, Departure Mono) are loaded
// from Fontshare via <link> in index.html. Only the Bengali stack and a
// monospaced fallback remain here, loaded conditionally below.
import "@fontsource/jetbrains-mono/400.css";

import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

// Lazily fetch Bangla webfonts only if the document declares Bengali content.
// Saves ~6 font files (~120 KB) on the initial English render.
if (typeof document !== "undefined") {
  const hasBangla = document.documentElement.lang?.startsWith("bn");
  if (hasBangla) {
    Promise.all([
      import("@fontsource/hind-siliguri/400.css"),
      import("@fontsource/hind-siliguri/600.css"),
      import("@fontsource/noto-sans-bengali/400.css"),
    ]).catch(() => {});
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>,
);
