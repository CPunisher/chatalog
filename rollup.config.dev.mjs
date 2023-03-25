import { defineConfig } from 'rollup';
import { exec } from 'child_process';
import config from './rollup.config.mjs';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default defineConfig({
  ...config,
  plugins: [
    ...config.plugins,
    serve({
      contentBase: ".",
      port: 8000,
    }),
    livereload({
      watch: './output/report.html',
    }),
    {
      name: 'report-generator',
      generateBundle: () => {
        exec("node ./dist/chatalog-cli/index.js report -o ./output/report.html ./output/messages/**", (error) => {
          if (error) {
            console.error(error);
            return;
          }
          console.log("updated report.html");
        })
      }
    }
  ]
});