import type { Express } from "express";
import { v4 as uuidv4 } from "uuid";
import fsPromise from "fs/promises";
import path from "path";
import child_process from "child_process";
import {
  RequestValidateStringTrans,
  ResponseValidate,
} from "@chatalog/network/interface";

function generatePython(functionName: string, source: string, input: string) {
  const result = `${source}
print(${functionName}("${input.replace(/\"/gm, '\\"')}"), end='')
`;
  return result;
}

export default async function useStringTrans(app: Express) {
  app.post("/string-trans", async (req, res) => {
    const { code, caller, data } = req.body as RequestValidateStringTrans;
    const inputs = data.examples.map(([input, _]) => input);
    const actual: [string, string][] = [];
    for (const input of inputs) {
      const wrappedCode = generatePython(caller, code, input);
      const tmpFile = path.join("/tmp", `${uuidv4()}.py`);
      console.log(tmpFile);
      await fsPromise.writeFile(tmpFile, wrappedCode);

      const proc = child_process.spawnSync("python3", [tmpFile], {
        timeout: 5000,
      });
      const output = proc.stdout.toString() || proc.stderr.toString();
      actual.push([input, output]);
      await fsPromise.rm(tmpFile);
    }
    const respBody: ResponseValidate<[string, string][]> = {
      result: actual,
    };
    res.json(respBody);
  });
}
