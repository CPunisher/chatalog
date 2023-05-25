import express from "express";
import useChatGPT from "./chatgpt";
import useSouffle from "./souffle";
import useStringTrans from "./string-trans";

const app = express();
app.use(express.json({ limit: "2mb" }));
app.get("/", async (_, res) => {
  return res.json({
    message: "Hello Chatalog 👋",
  });
});

async function main() {
  console.log(`Starting Chatalog node service`);
  await useChatGPT(app);
  useSouffle(app);
  useStringTrans(app);

  const PORT = Number(process.env.PORT) || 4000;
  const HOST = process.env.HOST || "0.0.0.0";
  console.log("🎉 Started Chatalog node service success!");
  app.listen(PORT, HOST, () => {
    console.log(`🚀 Server ready at: http://${HOST}:${PORT}/`);
  });
}

main();
