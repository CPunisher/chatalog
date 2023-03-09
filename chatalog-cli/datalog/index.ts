import { Command } from "commander";
import { parseFromJs } from "./parser";
import fs from "fs/promises";
import path from "path";
import { DatalogFile, GroupedDatalogFiles } from "./interface";

async function createDatalogFile(filename: string): Promise<DatalogFile> {
  const parsed = path.parse(filename);
  const content = (await fs.readFile(filename)).toString();
  return {
    name: parsed.name,
    base: parsed.base,
    content,
  };
}

async function groupDatalogFiles(dir: string): Promise<GroupedDatalogFiles> {
  const files = (await fs.readdir(dir)).map((f) => path.resolve(dir, f));
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
    facts: await Promise.all(facts),
    expected: await Promise.all(expected),
    rules: await Promise.all(rules),
  };
}

const datalog = new Command("datalog");
datalog.argument("<directories...>");
datalog.requiredOption("-t, --template <template>", "Template JavaSciprt file");
datalog.action(async (directories, options) => {
  const { template } = options;
  const templateFn = await parseFromJs(template);
  for (const dir of directories) {
    const grouped = await groupDatalogFiles(dir);
    const resultTemplate = templateFn(grouped);
    console.log(resultTemplate);
  }
});

export default datalog;
