import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "path";
import { Command } from "commander";
import retry from "async-retry";
import { ConversationOptions } from "./interface";
import { Module } from "@chatalog/interface/commons";
import { request } from "@chatalog/network/";
import {
  RequestConversation,
  ResponseConversation,
} from "@chatalog/network/interface";
import { createBar } from "../../util/progress";

const CommandConversation = new Command("conversation")
  .argument("<sources...>")
  .option("-o, --outDir <dir>", "Output directory")
  .option("-t, --target <url>", "Request url")
  .action(async (sources: string[], options: ConversationOptions) => {
    const startTime = Date.now();
    const bar = createBar(sources.length);
    const { outDir, target } = options;
    for (const source of sources) {
      bar.increment(1, { filename: path.basename(source) });
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
            console.error(`Getting response failed, retrying...`);
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
    bar.stop();
    const usedTime = Date.now() - startTime;
    console.log(
      `Finish ${sources.length} tasks in ${usedTime} ms, avg: ${(
        usedTime / sources.length
      ).toFixed(3)}`
    );
  });

export { CommandConversation };
