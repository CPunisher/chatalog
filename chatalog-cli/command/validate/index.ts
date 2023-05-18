import { Command, Option } from "commander";
import retry from "async-retry";
import { ValidateConfig, ValidateOptions } from "./interface";
import { Module } from "../../../chatalog/interface/commons";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import Souffle from "./souffle";
import StringTrans from "./string-trans";
import { createBar } from "../../util/progress";

const CommandValidate = new Command("validate")
  .argument("<sources...>", "Validate source JSON files")
  .addOption(
    new Option("-t, --type <type>", "Template type").choices([
      "souffle",
      "string-trans",
    ])
  )
  .option("-u, --url <url>", "Runner request url")
  .option("-o, --outDir <dir>", "Output directory")
  .action(async (sources: string[], options: ValidateOptions) => {
    const { type, url, outDir } = options;
    let validateConfig: ValidateConfig<unknown>;
    switch (type) {
      case "souffle":
        validateConfig = Souffle as ValidateConfig<unknown>;
        break;
      case "string-trans":
        validateConfig = StringTrans as ValidateConfig<unknown>;
        break;
      default: {
        console.error(`Unknown template type: ${type}`);
        return;
      }
    }

    const startTime = Date.now();
    const bar = createBar(sources.length);
    for (const source of sources) {
      bar.increment(1, { filename: path.basename(source) });
      if (!fs.existsSync(source)) {
        console.error(`${source} doesn't exist`);
        continue;
      }

      const module: Module<unknown> = JSON.parse(
        fs.readFileSync(source).toString()
      );

      const codes = validateConfig.codeExtractor(
        module.messages
          .filter((msg) => msg.role === "system")
          .map((msg) => msg.content)
      );

      for (const code of codes) {
        const result = await validateConfig.doValidate(url, code, module);
        if (result) {
          module.testResult.push(result);
        }
      }

      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      const outFilePath = path.resolve(outDir, path.basename(source));
      fsPromises.writeFile(outFilePath, JSON.stringify(module, null, 2));
    }
    bar.stop();
    const usedTime = Date.now() - startTime;
    console.log(
      `Finish ${sources.length} tasks in ${usedTime} ms, avg: ${(
        usedTime / sources.length
      ).toFixed(3)}`
    );
  });

export { CommandValidate };
