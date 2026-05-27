import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    // Split heavy vendor deps into separate cacheable chunks to reduce initial JS parse cost
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes("node_modules")) return;
          // Keep React + everything that hard-depends on React in a single chunk so
          // there's no chance of a sibling chunk evaluating before React is initialised
          // (caused the production "Cannot read properties of undefined (reading 'forwardRef')" crash).
          if (
            id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/scheduler/") ||
            id.includes("/node_modules/react-router") ||
            id.includes("/node_modules/@radix-ui/") ||
            id.includes("react-helmet")
          ) {
            return "react-vendor";
          }
          if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils")) return "motion-vendor";
          if (id.includes("@supabase")) return "supabase-vendor";
          if (id.includes("@tanstack")) return "query-vendor";
          if (id.includes("embla-carousel")) return "carousel-vendor";
          if (id.includes("lucide-react")) return "icons-vendor";
          if (id.includes("recharts") || id.includes("d3-")) return "charts-vendor";
          if (id.includes("date-fns") || id.includes("dayjs")) return "date-vendor";
          if (id.includes("react-hook-form") || id.includes("zod")) return "forms-vendor";
          return "vendor";
        },
      },
    },
  },
}));
