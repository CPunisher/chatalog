import type { Express } from "express";
import { DatalogFile } from "../chatalog-cli/interface";
import fsPromise from "fs/promises";
import path from "path";
import childProcess from "child_process";

type PartialFile = Pick<DatalogFile, "name" | "content">;

interface Params {
  facts: PartialFile[];
  rule: PartialFile;
}

export default async function useSouffle(app: Express) {
  app.post("/souffle", async (req, res) => {
    const { facts, rule } = req.body as Params;
    const tmpDir = "/tmp";
    const factPaths = facts.map((fact) =>
      path.resolve(tmpDir, `${fact.name}.facts`)
    );
    const rulePath = path.resolve(tmpDir, `${rule.name}.dl`);
    // Write facts and rule to tmp file
    console.log(`Writing to temporary directory: ${tmpDir}...`);
    await Promise.all([
      ...facts.map((fact, i) =>
        fsPromise.writeFile(factPaths[i], fact.content)
      ),
      fsPromise.writeFile(rulePath, rule.content),
    ]);
    // Run souffle, return output relation
    console.log("Running souffle for results...");
    try {
      await new Promise<void>((resolve, reject) => {
        childProcess.exec(
          `souffle -F ${tmpDir} -D ${tmpDir} ${rulePath}`,
          async (error, _, stderr) => {
            if (error) {
              // Delete tmp files
              console.log(
                `Removing files in temporary directory: ${tmpDir}...`
              );
              await clear(tmpDir, [...factPaths, rulePath]);
              console.log(`Complete with error!`);
              res.json({
                result: stderr,
              });
              reject(error);
              return;
            }
            resolve();
          }
        );
      });
    } catch {
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

    // Delete tmp files
    console.log(`Removing files in temporary directory: ${tmpDir}...`);
    await clear(tmpDir, [...factPaths, ...files, rulePath]);

    console.log(`Complete!`);
    res.json({
      result: result[0] || "",
    });
  });
}

async function clear(tmpDir: string, files: string[]) {
  // Delete tmp files
  // await Promise.all([files.map((file) => fsPromise.rm(file))]);
}
