import { Command } from "commander";
import retry from "async-retry";
import nodeFetch from "node-fetch";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import Progress from "../util/progress";

const CommandSendMessage = new Command("send-message");
CommandSendMessage.option(
  "-s, --sources <sources...>",
  "Template source JSON file"
);
CommandSendMessage.requiredOption("-o, --outDir <dir>", "Output directory");
CommandSendMessage.requiredOption(
  "-r, --retries <retries>",
  "Max counts to retry in total",
  "5"
);
CommandSendMessage.requiredOption("-t, --target <url>", "ChatGPT request url");
CommandSendMessage.action(sendMessage);

export async function sendMessage(options: any) {
  const { sources, target, retries, outDir } = options;
  if (!sources && sources.length === 0) {
    // TODO: read from stdin
  }

  const progress = new Progress(sources.length);
  for (const source of sources) {
    progress.plus();
    progress.log(`Processing ${source}`);
    if (!fs.existsSync(source)) {
      console.error(`${source} doesn't exist!`);
    }

    const template = JSON.parse((await fsPromises.readFile(source)).toString());
    await retry(
      async () => {
        const response = await nodeFetch(target, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: template.resultTemplate,
          }),
        });
        const { message } = (await response.json()) as any;
        template["output"] = message;
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
        }

        const outFilePath = path.resolve(outDir, path.basename(source));
        fsPromises.writeFile(outFilePath, JSON.stringify(template, null, 2));
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

export default CommandSendMessage;
