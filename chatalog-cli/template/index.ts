import { Command, Option } from "commander";
import { TemplateOptions } from "./interface";
import Souffle from "./souffle";
import StringTrans from "./string-trans";
import path from "node:path";

const CommandTemplate = new Command("template")
  .argument("<targets...>")
  .addOption(
    new Option("-t, --type <type>", "Template type").choices([
      "souffle",
      "string-trans",
    ])
  )
  .option("-i, --template <template>", "Input template javascript file")
  .option("-o, --outDir <dir>", "Output directory")
  .action(async (targets: string[], options: TemplateOptions) => {
    const { type, template, outDir } = options;
    const [templateFn, error] = await import(
      path.resolve(process.cwd(), template)
    )
      .then((module) => [module.default, null])
      .catch((err) => [null, err]);

    if (error) {
      console.error(`Error loading template file ${template}: ${error}`);
      return;
    }

    switch (type) {
      case "souffle":
        Souffle(targets, { templateFn, outDir });
        break;
      case "string-trans":
        StringTrans(targets, { templateFn, outDir });
        break;
      default:
        console.error(`Unknown template type: ${type}`);
    }
  });

export { CommandTemplate };
