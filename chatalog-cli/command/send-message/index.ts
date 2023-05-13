import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "path";
import { Command } from "commander";
import retry from "async-retry";
import { ConversationOptions } from "./interface";
import { Module } from "../../interface/commons";
import { request } from "../../network";
import {
  RequestConversation,
  ResponseConversation,
} from "../../network/interface";

const CommandConversation = new Command("conversation")
  .argument("<sources...>")
  .option("-o, --outDir <dir>", "Output directory")
  .option("-t, --target <url>", "Request url")
  .action(async (sources: string[], options: ConversationOptions) => {
    const { outDir, target } = options;
    for (const source of sources) {
      if (!fs.existsSync(source)) {
        console.error(`${source} doesn't exist`);
        continue;
      }
      const module: Module<unknown> = JSON.parse(
        fs.readFileSync(source).toString()
      );

      await retry(
        async () => {
          const { messages } = await request<
            RequestConversation,
            ResponseConversation
          >(target, {
            messages: module.messages,
          });
          module.messages = messages;
        },
        {
          retries: 5,
          onRetry: (error) => {
            console.error(`Getting reply failed, retrying...`);
            console.error(error);
          },
        }
      );

      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      const outFilePath = path.resolve(outDir, path.basename(source));
      fsPromises.writeFile(outFilePath, JSON.stringify(module, null, 2));
    }
  });

export { CommandConversation };
