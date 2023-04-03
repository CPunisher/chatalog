import { Command } from "commander";
import retry from "async-retry";
import nodeFetch from "node-fetch";
import fs from "fs";
import fsPromises from "fs/promises";
import Progress from "../util/progress";
import { GroupedDatalogFiles } from "../interface";

const CommandFixMessage = new Command("fix-message");
CommandFixMessage.argument("<sources...>", "Template source JSON file");
CommandFixMessage.requiredOption(
  "-r, --retries <retries>",
  "Max counts to retry in total",
  "5"
);
CommandFixMessage.requiredOption("-t, --target <url>", "ChatGPT request url");
CommandFixMessage.action(fix);

export async function fix(sources: string[], options: any) {
  const { target, retries } = options;

  const progress = new Progress(sources.length);
  for (const source of sources) {
    progress.plus();
    progress.log(`Processing ${source}`);
    if (!fs.existsSync(source)) {
      console.error(`${source} doesn't exist!`);
    }

    const template: GroupedDatalogFiles = JSON.parse(
      (await fsPromises.readFile(source)).toString()
    );

    if (!shouldFix(template)) {
      progress.log(`Finish ${source}, which is no need to fix`);
      continue;
    }

    await retry(
      async () => {
        const response = await nodeFetch(target, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: template.messages[0].content,
          }),
        });
        const { message } = (await response.json()) as any;
        template.messages[1].content = message;
        fsPromises.writeFile(source, JSON.stringify(template, null, 2));
      },
      {
        retries,
        onRetry: (error) => {
          console.error(`Getting reply failed, retrying...`);
          console.error(error);
        },
      }
    );
    progress.log(`Finish ${source}`);
  }
}

function shouldFix(template: GroupedDatalogFiles) {
  return (
    !template.messages[1] ||
    template.messages[1].content === "Something went wrong"
  );
}

export default CommandFixMessage;
