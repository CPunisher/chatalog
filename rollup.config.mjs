import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from '@rollup/plugin-terser';
import tailwindcss from "tailwindcss";
import postcss from "rollup-plugin-postcss";
import autoprefixer from "autoprefixer";
import tailwindConfig from "./tailwind.config.js";

export default defineConfig({
  input: "report-page/index.tsx",
  output: {
    format: "iife",
    file: "lib/report-page/index.js",
    name: "renderReports",
    exports: "named",
    sourcemap: false,
  },
  plugins: [
    typescript({
      module: "esnext",
      compilerOptions: {
        outDir: "dist/report-page",
        sourceMap: false,
      },
    }),
    nodeResolve({ browser: true }),
    commonjs(),
    postcss({
      extensions: [".css"],
      plugins: [autoprefixer(), tailwindcss(tailwindConfig)],
    }),
    terser(),
  ],
});
