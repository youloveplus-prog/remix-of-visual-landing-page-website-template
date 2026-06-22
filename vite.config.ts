import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";
import { generateSitemap } from "./scripts/generate-sitemap";

/**
 * Regenerates `public/sitemap.xml` once per Vite startup (dev + build).
 * Runs at `buildStart` so the file is on disk before the dev server
 * serves `public/` and before the build copies it into `dist/`.
 */
function sitemapPlugin(): Plugin {
  let ran = false;
  return {
    name: "asikon-sitemap",
    buildStart() {
      if (ran) return;
      ran = true;
      try {
        generateSitemap("public");
      } catch (err) {
        this.warn(`sitemap generation failed: ${(err as Error).message}`);
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    sitemapPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    minify: "esbuild",
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Group large 3rd-party libs into stable shared chunks so each
        // lazy page chunk stays small and these vendors cache cross-route.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || id.match(/[\\/]react[\\/]/) || id.includes("scheduler")) return "react";
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (
            id.includes("react-markdown") ||
            id.includes("remark") ||
            id.includes("rehype") ||
            id.includes("streamdown") ||
            id.includes("@streamdown")
          ) return "markdown";
          if (id.includes("framer-motion") || id.includes("/motion/")) return "motion";
          if (id.includes("embla-carousel")) return "embla";
          if (id.includes("@tanstack")) return "tanstack";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@fontsource")) return "fonts";
        },
      },
    },
  },
}));
