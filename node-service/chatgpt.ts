import { ChatMessage } from "chatgpt";
import type { Express } from "express";
import createHttpsProxyAgent from "https-proxy-agent";
import nodeFetch from "node-fetch";
import { ConvMessage } from "../chatalog-cli/interface/commons";

interface ChatGPTAPIConfig {
  token: string;
  proxy?: string;
}

function loadConfig(): ChatGPTAPIConfig {
  const token = process.env.ACCESS_TOKEN;
  if (!token) {
    throw new Error("Please provide your access token in environment variable");
  }

  return {
    token,
    proxy:
      process.env.HTTPS_PROXY ||
      process.env.HTTP_PROXY ||
      process.env.ALL_PROXY,
  };
}

export default async function useChatGPT(app: Express) {
  const { ChatGPTUnofficialProxyAPI } = await import("chatgpt");
  const config = loadConfig();
  // console.log(`🔧 Loaded config: ${JSON.stringify(config, null, 2)}`);

  const api = new ChatGPTUnofficialProxyAPI({
    // apiReverseProxyUrl: "https://gpt.pawan.krd/backend-api/conversation",
    apiReverseProxyUrl: "https://freechat.xyhelper.cn/backend-api/conversation",
    accessToken: config.token,
    fetch: (input: RequestInfo | URL, init?: object) =>
      nodeFetch(input as any, {
        agent: config.proxy ? createHttpsProxyAgent(config.proxy) : undefined,
        ...init,
      }) as any,
  });

  app.post("/message", async (req, res) => {
    try {
      const isArray = Array.isArray(req.body.messages);
      const messages: ConvMessage[] = isArray
        ? req.body.messages
        : [req.body.messages];

      const answers: ConvMessage[] = [];
      let lastMessage: ChatMessage | undefined;
      for (const message of messages) {
        answers.push(message);
        const response = await api.sendMessage(message.content, {
          timeoutMs: 5 * 60 * 1000,
          parentMessageId: lastMessage?.parentMessageId,
          conversationId: lastMessage?.conversationId,
        });
        console.log(response.parentMessageId, response.conversationId);
        answers.push({ role: "system", content: response.text });
        lastMessage = response;
      }
      return res.json({
        messages: answers,
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: "Something went wrong",
        error: e,
      });
    }
  });
}
