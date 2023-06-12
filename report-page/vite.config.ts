import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  root: path.join(__dirname, "./example"),
  plugins: [preact()],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
      "@chatalog": path.join(__dirname, "..", "chatalog"),
    },
  },
  build: {
    outDir: "../../lib/report-page",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "./src/index.tsx"),
      formats: ["iife"],
      name: "renderReports",
      fileName: () => "index.js",
    },
  },
});
