import { ChatMessage } from "chatgpt";
import type { Express } from "express";
import createHttpsProxyAgent from "https-proxy-agent";
import nodeFetch from "node-fetch";
import { ConvMessage } from "@chatalog/interface/commons";
import {
  RequestConversation,
  ResponseConversation,
} from "@chatalog/network/interface";

interface ChatGPTAPIConfig {
  token?: string;
  proxy?: string;
  gpt4?: boolean;
}

function loadConfig(): ChatGPTAPIConfig {
  return {
    token: process.env.ACCESS_TOKEN,
    proxy:
      process.env.HTTPS_PROXY ||
      process.env.HTTP_PROXY ||
      process.env.ALL_PROXY,
    gpt4: Boolean(process.env.GPT4) || false,
  };
}

export default async function useChatGPT(app: Express) {
  const { ChatGPTUnofficialProxyAPI } = await import("chatgpt");
  const config = loadConfig();

  const api = new ChatGPTUnofficialProxyAPI({
    // apiReverseProxyUrl: "https://gpt.pawan.krd/backend-api/conversation",
    apiReverseProxyUrl: "https://freechat.xyhelper.cn/backend-api/conversation",
    accessToken: config.token ?? "",
    // model: config.gpt4 ? "gpt-4" : undefined,
    fetch: (input: RequestInfo | URL, init?: any) => {
      //   const body = JSON.parse(init.body || "{}");
      //   body["arkose_token"] =
      //     "8091767a8533e2193.5553066805|r=eu-west-1|meta=3|meta_width=300|metabgclr=transparent|metaiconclr=%23555555|guitextcolor=%23000000|pk=35536E1E-65B4-4D96-9D97-6ADB7EFF8147|at=40|sup=1|rid=100|ag=101|cdn_url=https%3A%2F%2Ftcr9i.chat.openai.com%2Fcdn%2Ffc|lurl=https%3A%2F%2Faudio-eu-west-1.arkoselabs.com|surl=https%3A%2F%2Ftcr9i.chat.openai.com|smurl=https%3A%2F%2Ftcr9i.chat.openai.com%2Fcdn%2Ffc%2Fassets%2Fstyle-manager";
      //   init = {
      //     ...init,
      //     body: JSON.stringify(body),
      //   };

      return nodeFetch(input as any, {
        agent: config.proxy ? createHttpsProxyAgent(config.proxy) : undefined,
        ...init,
      }) as any;
    },
  });

  app.post("/message", async (req, res) => {
    const { messages } = req.body as RequestConversation;

    const answers: ConvMessage[] = [];
    let lastMessage: ChatMessage | undefined;
    try {
      for (const message of messages) {
        answers.push(message);
        const response = await api.sendMessage(message.content, {
          timeoutMs: 5 * 60 * 1000,
          parentMessageId: lastMessage?.parentMessageId,
          conversationId: lastMessage?.conversationId,
        });
        answers.push({ role: "system", content: response.text });
        lastMessage = response;
        console.log(
          `Request: ${message.content.slice(
            0,
            20
          )}, Response: ${response.text.slice(0, 20)}`
        );
      }

      const respBody: ResponseConversation = {
        messages: answers,
      };

      return res.json(respBody);
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "!!Something went wrong",
        error: e,
      });
    }
  });
}
