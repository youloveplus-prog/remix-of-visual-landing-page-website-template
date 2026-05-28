// Self-hosted fonts — trimmed to weights actually used. Bengali stack is
// dynamically loaded only when needed (see loadBanglaFonts below).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
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
