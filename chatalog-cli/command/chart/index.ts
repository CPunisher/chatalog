import { Command, Option } from "commander";
import fsPromise from "fs/promises";
import path from "path";
import { ChartOptions } from "./interface";
import { Module, TestResult } from "@chatalog/interface/commons";
import { ChartData } from "@chatalog/interface/chart";

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
    <main id="app"></main>
    <script>
${script}
    </script>
    <script>
      const data = ${data};
      const run = () => {
        const target = document.querySelector("main");
        renderReportCharts(target, data);
      }
      document.addEventListener('DOMContentLoaded', run);
    </script>
  </body>
  </html>
`;

const CommandChart = new Command("chart")
  .argument("<dataList...>")
  .option("-o, --outFile <outFile>", "Output file")
  .action(async (dataList: string[], options: ChartOptions) => {
    const { outFile } = options;

    const data: Record<string, Module<never>[]> = {};
    for (const dataFile of dataList) {
      const module: Module<never> = JSON.parse(
        (await fsPromise.readFile(dataFile)).toString()
      );
      // TODO
      const templateName = path.basename(path.join(dataFile, "..", ".."));
      const list = data[templateName] || [];
      list.push(module);
      data[templateName] = list;
    }

    // fileName -> ChartData
    const appData: Record<string, ChartData> = {};
    for (const [templateName, modules] of Object.entries(data)) {
      for (const module of modules) {
        const list = appData[module.name] ?? [];
        // 最大准确项
        const { expected, passId } = module.testResult.reduce(
          (prev, current) =>
            prev.passId.length <= current.passId.length ? current : prev,
          {
            code: "",
            expected: [],
            actual: [],
            passId: [],
            pass: false,
          } as TestResult
        );
        // 三组数据, value 比率, count/total 绝对值，还需要加个结果类型
        list.push({
          templateName,
          value: 0,
          count: passId.length,
          total: expected.length,
        });
        appData[module.name] = list;
      }
    }

    const [style, script] = await Promise.all([
      fsPromise.readFile(
        path.join(process.cwd(), "lib", "report-chart-page", "style.css")
      ),
      fsPromise.readFile(
        path.join(process.cwd(), "lib", "report-chart-page", "index.js")
      ),
    ]);
    const html = buildHtmlTemplate(
      new Date().toISOString(),
      style.toString(),
      script.toString(),
      JSON.stringify(appData)
    );

    await fsPromise.writeFile(outFile, html);
  });

export { CommandChart };
