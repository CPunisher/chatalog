import { Command, Option } from "commander";
import fsPromise from "fs/promises";
import path from "path";
import { ReportOptions } from "./interface";

const buildHtmlTemplate = (
  title: string,
  style: string,
  script: string,
  type: string,
  data: string
) =>
  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${title}</title>
    <style>
${style}
    </style>
  </head>    
  <body>
    <main></main>
    <script>
${script}
    </script>
    <script>
      const data = ${data};
      const type = ${type};
      const run = () => {
        const target = document.querySelector("main");
        renderReports(target, type, data);
      }
      document.addEventListener('DOMContentLoaded', run);
    </script>
  </body>
  </html>
`;

const CommandReport = new Command("report")
  .argument("<data...>")
  .addOption(
    new Option("-t, --type <type>", "Template type").choices([
      "souffle",
      "string-trans",
    ])
  )
  .option("-o, --outFile <outFile>", "Output file")
  .action(async (data: string[], options: ReportOptions) => {
    const { type, outFile } = options;
    const dataList = await Promise.all(
      data.map(async (s) =>
        JSON.parse((await fsPromise.readFile(s)).toString())
      )
    );
    const [style, script] = await Promise.all([
      fsPromise.readFile(
        path.join(process.cwd(), "lib", "report-page", "style.css")
      ),
      fsPromise.readFile(
        path.join(process.cwd(), "lib", "report-page", "index.js")
      ),
    ]);
    const html = buildHtmlTemplate(
      new Date().toISOString(),
      style.toString(),
      script.toString(),
      JSON.stringify(type),
      JSON.stringify(dataList)
    );

    await fsPromise.writeFile(outFile, html);
  });

export default CommandReport;
