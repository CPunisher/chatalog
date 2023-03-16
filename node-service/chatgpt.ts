import type { Express } from "express";
import createHttpsProxyAgent from "https-proxy-agent";
import nodeFetch from "node-fetch";

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
    apiReverseProxyUrl: "https://gpt.pawan.krd/backend-api/conversation",
    accessToken: config.token,
    fetch: (input: string, init: object) =>
      nodeFetch(input, {
        agent: config.proxy ? createHttpsProxyAgent(config.proxy) : undefined,
        ...init,
      }),
  });

  app.post("/message", async (req, res) => {
    try {
      const { message } = req.body;
      console.log(`Received message: ${message}`);
      const response = await api.sendMessage(message);
      return res.json({
        message: response.text,
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
