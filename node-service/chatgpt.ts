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
}

function loadConfig(): ChatGPTAPIConfig {
  return {
    token: process.env.ACCESS_TOKEN,
    proxy:
      process.env.HTTPS_PROXY ||
      process.env.HTTP_PROXY ||
      process.env.ALL_PROXY,
  };
}

export default async function useChatGPT(app: Express) {
  const { ChatGPTUnofficialProxyAPI } = await import("chatgpt");
  const config = loadConfig();

  const api = new ChatGPTUnofficialProxyAPI({
    // apiReverseProxyUrl: "https://gpt.pawan.krd/backend-api/conversation",
    apiReverseProxyUrl: "https://freechat.xyhelper.cn/backend-api/conversation",
    accessToken: config.token ?? "",
    fetch: (input: RequestInfo | URL, init?: object) =>
      nodeFetch(input as any, {
        agent: config.proxy ? createHttpsProxyAgent(config.proxy) : undefined,
        ...init,
      }) as any,
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
