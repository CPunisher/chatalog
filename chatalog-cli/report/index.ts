import { Command } from "commander";
import { GroupedDatalogFiles } from "../interface";
import fsPromise from "fs/promises";
import path from "path";

const CommandReport = new Command("report");
CommandReport.argument("<data...>");
CommandReport.requiredOption("-o, --out <file>", "Output file");
CommandReport.action(report);

const buildHtmlTemplate = (
  title: string,
  style: string,
  script: string,
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
      const run = () => {
        const target = document.querySelector("main");
        renderReports.default(target, data);
      }
      document.addEventListener('DOMContentLoaded', run);
    </script>
  </body>
  </html>
`;

export async function report(data: string[], options: any) {
  const { out } = options;
  const groupdFiles: GroupedDatalogFiles[] = await Promise.all(
    data.map(async (s) => JSON.parse((await fsPromise.readFile(s)).toString()))
  );
  const script = await fsPromise.readFile(
    path.join(__dirname, "../../report-page/index.js")
  );
  const html = buildHtmlTemplate(
    "Title",
    "",
    script.toString(),
    JSON.stringify(groupdFiles)
  );

  await fsPromise.writeFile(out, html);
}

export default CommandReport;
