import type { Express } from "express";
import { DatalogFile, GroupedDatalogFiles } from "../chatalog-cli/interface";
import fsPromise from "fs/promises";
import path from "path";
import util from "node:util";
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
    const { stdout, stderr } = await util.promisify(childProcess.exec)(
      `souffle -F ${tmpDir} -D - ${rulePath}`
    );
    // Delete tmp files
    console.log(`Removing files in temporary directory: ${tmpDir}...`);
    await Promise.all([
      ...factPaths.map((path) => fsPromise.rm(path)),
      fsPromise.rm(rulePath),
    ]);

    res.json({
      result: stdout,
    });
  });
}
