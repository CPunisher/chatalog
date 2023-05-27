import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./report-page/example",
  plugins: [preact()],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
  build: {
    outDir: "../../lib/report-page",
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, "report-page/src/index.tsx"),
      formats: ["iife"],
      name: "renderReports",
      fileName: () => "index.js",
    },
  },
});
