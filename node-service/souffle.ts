import type { Express } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";
import childProcess from "child_process";
import { RequestValidateSouffle } from "@chatalog/network/interface";

export default async function useSouffle(app: Express) {
  app.post("/souffle", async (req, res) => {
    const { code, data } = req.body as RequestValidateSouffle;
    const tmpDir = path.join("/tmp", uuidv4());
    fs.mkdirSync(tmpDir);

    const factPaths = data.facts.map((fact) =>
      path.resolve(tmpDir, `${fact.name}.facts`)
    );
    const rulePath = path.resolve(tmpDir, `${data.rules[0].name}.dl`);
    // Write facts and rule to tmp file
    console.log(`Writing to temporary directory: ${tmpDir}...`);
    await Promise.all([
      ...data.facts.map((fact, i) =>
        fsPromise.writeFile(factPaths[i], fact.content)
      ),
      fsPromise.writeFile(rulePath, code),
    ]);
    // Run souffle, return output relation
    console.log("Running souffle for results...");
    const error = await new Promise<string | null>((resolve, reject) => {
      childProcess.exec(
        `souffle -F ${tmpDir} -D ${tmpDir} ${rulePath}`,
        async (error, _, stderr) => {
          if (error) {
            reject(stderr);
          }
          resolve(null);
        }
      );
    }).catch((err) => err);

    if (error) {
      // Delete tmp files
      await fsPromise.rm(tmpDir, { recursive: true, force: true });
      console.log(`Error: ${error}`);
      res.json({
        result: [error],
      });
      return;
    }

    // Read result
    console.log(`Reading from temporary directory: ${tmpDir}...`);
    const files = (await fsPromise.readdir(tmpDir))
      .filter((file) => file.endsWith(".csv"))
      .map((file) => path.resolve(tmpDir, file));
    const result = (
      await Promise.all(files.map((file) => fsPromise.readFile(file)))
    ).map((buffer) => buffer.toString());

    await fsPromise.rm(tmpDir, { recursive: true, force: true });
    res.json({
      result: result,
    });
  });
}
