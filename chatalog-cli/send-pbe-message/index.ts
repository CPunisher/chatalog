import { Command } from "commander";
import retry from "async-retry";
import nodeFetch from "node-fetch";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import Progress from "../util/progress";
import { ConvMessage } from "../interface";

const CommandSendPBEMessage = new Command("send-pbe-message");
CommandSendPBEMessage.argument("<sources...>", "Template source JSON file");
CommandSendPBEMessage.requiredOption("-o, --outDir <dir>", "Output directory");
CommandSendPBEMessage.requiredOption(
  "-r, --retries <retries>",
  "Max counts to retry in total",
  "5"
);
CommandSendPBEMessage.requiredOption(
  "-t, --target <url>",
  "ChatGPT request url"
);
CommandSendPBEMessage.action(sendMessage);

export async function sendMessage(sources: string[], options: any) {
  const { target, retries, outDir } = options;
  if (!sources || sources.length === 0) {
    // TODO: read from stdin
  }

  const progress = new Progress(sources.length);
  for (const source of sources) {
    progress.plus();
    progress.log(`Processing ${source}`);
    if (!fs.existsSync(source)) {
      console.error(`${source} doesn't exist!`);
    }

    const template: { messages: ConvMessage[] } = JSON.parse(
      (await fsPromises.readFile(source)).toString()
    );

    await retry(
      async () => {
        const response = await nodeFetch(target, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: [
              template.messages[0].content,
              template.messages[1].content,
            ],
          }),
        });
        const message = (await response.json()).message as string[];
        template.messages.push(
          ...message.map((msg: string) => ({ content: msg }))
        );
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

export default CommandSendPBEMessage;
