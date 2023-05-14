import { Module } from "../../../chatalog/interface/commons";
import { StringTransData } from "../../../chatalog/interface/string-trans";
import { TemplateAction } from "./interface";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse";

const StringTrans: TemplateAction<StringTransData> = async (
  targets,
  options
) => {
  const { templateFn, outDir } = options;
  const modules: Module<StringTransData>[] = [];
  for (const csv of targets) {
    if (!fs.existsSync(csv)) {
      console.error(`${csv} doesn't exist!`);
      continue;
    }
    const csvContent = await fsPromises.readFile(csv);
    const parser = parse({ delimiter: "," });
    const module: Module<StringTransData> = {
      name: path.basename(csv),
      messages: [],
      testResult: [],
      data: {
        examples: [],
      },
    };
    await new Promise<void>((resolve) => {
      parser.on("readable", function () {
        let record;
        while ((record = parser.read()) != null) {
          module.data.examples.push([record[0], record[1]]);
        }
        resolve();
      });
      parser.write(csvContent);
      parser.end();
    });
    const generatedTemplate = templateFn(module);
    module.messages.push({
      role: "user",
      content: generatedTemplate,
    });
    modules.push(module);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outFilePath = path.resolve(outDir, `${path.basename(csv)}.json`);
    fsPromises.writeFile(outFilePath, JSON.stringify(module, null, 2));
  }
};

export default StringTrans;
