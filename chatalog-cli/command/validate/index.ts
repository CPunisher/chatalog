import { Command } from "commander";
import retry from "async-retry";
import { ValidateConfig, ValidateOptions } from "./interface";
import { Module } from "../../interface/commons";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import Souffle from "./souffle";
import StringTrans from "./string-trans";

const CommandValidate = new Command("validate")
  .argument("<sources...>", "Validate source JSON files")
  .option("-t, --target <url>", "Runner request url")
  .option("-o, --outDir <dir>", "Output directory")
  .action(async (sources: string[], options: ValidateOptions) => {
    const { type, target, outDir } = options;
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

    for (const source of sources) {
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
        await retry(
          async () => {
            const result = await validateConfig.doValidate(
              target,
              code,
              module
            );
            if (result) {
              module.testResult.push(result);
            }
          },
          {
            retries: 5,
            onRetry: (error) => {
              console.error(`Getting response failed, retrying...`);
              console.error(error);
            },
          }
        );
      }

      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      const outFilePath = path.resolve(outDir, path.basename(source));
      fsPromises.writeFile(outFilePath, JSON.stringify(module, null, 2));
    }
  });

export { CommandValidate };
