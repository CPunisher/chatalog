import type { Express } from "express";
import { PythonShell } from "python-shell";
import fsPromise from "fs/promises";

interface Params {
  inputs: string[];
  functionName: string;
  source: string;
}

function generatePython(functionName: string, source: string) {
  const result = `${source}
count = 0
while True:
  try:
    val = input()
    out = ${functionName}(val)
    count += 1
    print(f"{count}###{val}###{out}")
  except EOFError:
    break
`;
  return result;
}

export default async function usePBE(app: Express) {
  app.post("/pbe", async (req, res) => {
    const { inputs, functionName, source } = req.body as Params;
    const code = generatePython(functionName, source);
    await fsPromise.writeFile("/tmp/tmp.py", code);

    const shell = new PythonShell("/tmp/tmp.py");
    const actual: [string, string][] = [];
    await new Promise<void>((resolve, reject) => {
      for (const input of inputs) {
        shell.send(input);
      }
      shell.on("message", function (message: string) {
        const arr = message.split("###");
        if (arr.length === 3) {
          actual.push([arr[1], arr[2]]);
          if (arr[0] === inputs.length.toString()) {
            resolve();
          }
        }
      });
      setTimeout(() => reject(), 5000);
    }).catch(() => {
      console.error("Reject", source);
    });
    shell.end(() => {});
    res.json({
      result: actual,
    });
  });
}
