import { Command } from "commander";
import { parseFromJs } from "./parser";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { DatalogFile, GroupedDatalogFiles } from "../interface";
import Progress from "../util/progress";

async function createDatalogFile(filename: string): Promise<DatalogFile> {
  const parsed = path.parse(filename);
  const content = (await fsPromises.readFile(filename)).toString();
  return {
    name: parsed.name,
    base: parsed.base,
    content,
  };
}

async function groupDatalogFiles(dir: string): Promise<GroupedDatalogFiles> {
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
    facts: await Promise.all(facts),
    expected: await Promise.all(expected),
    rules: await Promise.all(rules),
    messages: [],
  };
}

const CommandGenerateTemplate = new Command("generate-template");
CommandGenerateTemplate.argument("<directories...>");
CommandGenerateTemplate.requiredOption(
  "-t, --template <template>",
  "Template JavaSciprt file"
);
CommandGenerateTemplate.requiredOption(
  "-o, --outDir <dir>",
  "Output directory"
);
CommandGenerateTemplate.action((directories, options) => {
  generateTemplate(directories, options, true);
});

export async function generateTemplate(
  directories: string[],
  options: any,
  emit = true
) {
  const { template, outDir } = options;
  const templateFn = await parseFromJs(template);
  const result: GroupedDatalogFiles[] = [];

  const progess = new Progress(directories.length);
  for (const dir of directories) {
    progess.plus();
    progess.log(`Processing ${dir}`);
    if (!fs.existsSync(dir)) {
      console.error(`${dir} doesn't exists!`);
      continue;
    }
    if (!fs.lstatSync(dir).isDirectory()) {
      console.error(`${dir} is not directory!`);
      continue;
    }

    const grouped = await groupDatalogFiles(dir);
    const resultTemplate = templateFn(grouped);
    grouped.messages.push({ content: resultTemplate });
    result.push(grouped);

    if (emit) {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      const outFilePath = path.resolve(outDir, `${path.basename(dir)}.json`);
      fsPromises.writeFile(
        outFilePath,
        JSON.stringify(result[result.length - 1], null, 2)
      );
    }
  }
  return result;
}

export default CommandGenerateTemplate;
