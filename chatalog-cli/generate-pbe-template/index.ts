import { Command } from "commander";
import { parseFromJs } from "../generate-template/parser";
import { NormalFiles } from "../interface";
import Progress from "../util/progress";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { parse } from "csv-parse";

const CommandGeneratePBETemplate = new Command("generate-pbe-template");
CommandGeneratePBETemplate.argument("<csvs...>");
CommandGeneratePBETemplate.requiredOption(
  "-t, --template <template>",
  "Template JavaSciprt file"
);
CommandGeneratePBETemplate.requiredOption(
  "-o, --outDir <dir>",
  "Output directory"
);
CommandGeneratePBETemplate.action((csvs, options) => {
  generatePBE(csvs, options, true);
});

export async function generatePBE(csvs: string[], options: any, emit = true) {
  const { template, outDir } = options;
  const templateFn = await parseFromJs(template);
  const result: NormalFiles[] = [];

  const progess = new Progress(csvs.length);
  for (const csv of csvs) {
    progess.plus();
    progess.log(`Processing ${csv}`);
    if (!fs.existsSync(csv)) {
      console.error(`${csv} doesn't exists!`);
      continue;
    }

    const content = await fsPromises.readFile(csv);
    const parser = parse({ delimiter: "," });
    const pbe: NormalFiles = {
      name: path.basename(csv),
      examples: [],
      messages: [],
    };
    await new Promise<void>((resolve) => {
      parser.on("readable", function () {
        let record;
        while ((record = parser.read()) !== null) {
          pbe.examples.push([record[0], record[1]]);
        }
        resolve();
      });
      parser.write(content);
      parser.end();
    });
    const resultTemplate = [templateFn(pbe)];
    pbe.messages.push(
      ...resultTemplate.flat(Infinity).map((t) => ({ content: t }))
    );
    result.push(pbe);

    if (emit) {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      const outFilePath = path.resolve(outDir, `${path.basename(csv)}.json`);
      fsPromises.writeFile(
        outFilePath,
        JSON.stringify(result[result.length - 1], null, 2)
      );
    }
  }
  return result;
}

export default CommandGeneratePBETemplate;
