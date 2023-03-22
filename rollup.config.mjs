import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

export default defineConfig({
  input: 'report-page/index.tsx',
  output: {
    format: 'iife',
    file: 'dist/report-page/index.js',
    name: 'renderReports',
    exports: 'named',
  },
  plugins: [
    typescript({
      module: 'esnext',
      compilerOptions: {
        outDir: 'dist/report-page',
      }
    }),
    nodeResolve(),
  ],
});