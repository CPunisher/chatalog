import { Command } from "commander";
import Progress from "../util/progress";
import retry from "async-retry";
import nodeFetch from "node-fetch";
import fs from "fs";
import fsPromises from "fs/promises";
import { NormalFiles } from "../interface";

const CommandTestPBE = new Command("test-pbe");
CommandTestPBE.argument("<sources...>", "Test source JSON files");
CommandTestPBE.requiredOption(
  "-r, --retries <retries>",
  "Max counts to retry in total",
  "5"
);
CommandTestPBE.requiredOption(
  "-t, --target <url>",
  "Python runner request url"
);
CommandTestPBE.action(test);

export async function test(sources: string[], options: any) {
  const { target, retries } = options;
  const progress = new Progress(sources.length);
  for (const source of sources) {
    progress.plus();
    progress.log(`Processing ${source}`);
    if (!fs.existsSync(source)) {
      console.error(`${source} doesn't exist!`);
    }

    const template: NormalFiles = JSON.parse(
      (await fsPromises.readFile(source)).toString()
    );

    // Extract rule in template
    const answer = template.messages[1].content;
    const answerCode = extractAnswerCode(answer);
    if (answerCode.length == 0) {
      progress.log(`Finish ${source}, no answer rule is found`);
      continue;
    }

    template.testResult = [];
    for (const [code, functionName] of answerCode) {
      await retry(
        async () => {
          const response = await nodeFetch(target, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: template.examples.map((e) => e[0]),
              functionName,
              source: code,
            }),
          });
          const { result } = (await response.json()) as any;
          const pass = checkResult(template.examples, result);
          progress.log(`${source}: ${pass}`);
          template.testResult?.push({
            code: "```python\n" + code + "\n```",
            actual: result,
            pass,
          });
        },
        {
          retries,
          onRetry: (error) => {
            console.error(`Getting reply failed, retrying...`);
            console.error(error);
          },
        }
      );
    }
    fsPromises.writeFile(source, JSON.stringify(template, null, 2));
    progress.log(`Finish ${source}`);
  }
}

function extractAnswerCode(answer: string) {
  const PATTERN = /```(?:.*?)(?:\n|$)/gm;
  const matches = [...answer.matchAll(PATTERN)];
  const result: [string, string][] = [];
  for (let i = 0; i < matches.length; i += 2) {
    const match = matches[i];
    if (match.index) {
      const next = matches[i + 1]?.index ?? answer.length;
      const code = answer.substring(match.index + match[0].length, next - 1);
      const functionName = code.match(/def (\w*)/)?.[1];
      if (functionName) {
        result.push([code, functionName]);
      }
    }
  }
  return result;
}

function checkResult(examples: [string, string][], result: [string, string][]) {
  for (const [input, output] of result) {
    const truth = examples.find((pair) => pair[0] === input)?.[1];
    if (truth !== output) {
      return false;
    }
  }
  return true;
}

export default CommandTestPBE;
