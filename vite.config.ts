import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./report-page/example",
  plugins: [preact()],
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
