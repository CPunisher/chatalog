import { Module } from "../../../chatalog/interface/commons";
import { SouffleData, SouffleFile } from "../../../chatalog/interface/souffle";
import { TemplateAction } from "./interface";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";

const Souffle: TemplateAction<SouffleData> = async (targets, options) => {
  const { templateFn, outDir } = options;
  const modules: Module<SouffleData>[] = [];
  for (const dir of targets) {
    if (!fs.existsSync(dir)) {
      console.error(`${dir} doesn't exist!`);
      continue;
    }
    if (!fs.lstatSync(dir).isDirectory) {
      console.error(`${dir} is not directory!`);
      continue;
    }
    const module = await getSouffleModule(dir);
    const generatedTemplate = templateFn(module);
    module.messages.push({
      role: "user",
      content: generatedTemplate,
    });
    modules.push(module);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outFilePath = path.resolve(outDir, `${path.basename(dir)}.json`);
    fsPromises.writeFile(outFilePath, JSON.stringify(module, null, 2));
  }
};

async function createDatalogFile(filename: string): Promise<SouffleFile> {
  const parsed = path.parse(filename);
  const content = (await fsPromises.readFile(filename)).toString();
  return {
    name: parsed.name,
    base: parsed.base,
    content,
  };
}

async function getSouffleModule(dir: string): Promise<Module<SouffleData>> {
  const files = (await fsPromises.readdir(dir)).map((f) =>
    path.resolve(dir, f)
  );
  const facts = [],
    expected = [],
    rules = [];
  for (const file of files) {
    switch (path.extname(file)) {
      case ".facts":
        facts.push(createDatalogFile(file));
        break;
      case ".expected":
        expected.push(createDatalogFile(file));
        break;
      case ".dl":
        rules.push(createDatalogFile(file));
        break;
    }
  }

  return {
    name: path.basename(dir),
    messages: [],
    testResult: [],
    data: {
      facts: await Promise.all(facts),
      expected: await Promise.all(expected),
      rules: await Promise.all(rules),
    },
  };
}

export default Souffle;
