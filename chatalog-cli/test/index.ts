import { Command } from "commander";
import Progress from "../util/progress";
import retry from "async-retry";
import nodeFetch from "node-fetch";
import fs from "fs";
import fsPromises from "fs/promises";
import { GroupedDatalogFiles } from "../interface";

const CommandTest = new Command("test");
CommandTest.argument("<sources...>", "Test source JSON files");
CommandTest.requiredOption(
  "-r, --retries <retries>",
  "Max counts to retry in total",
  "5"
);
CommandTest.requiredOption("-t, --target <url>", "Souffle runner request url");
CommandTest.action(test);

export async function test(sources: string[], options: any) {
  const { target, retries } = options;
  const progress = new Progress(sources.length);
  for (const source of sources) {
    progress.plus();
    progress.log(`Processing ${source}`);
    if (!fs.existsSync(source)) {
      console.error(`${source} doesn't exist!`);
    }

    const template: GroupedDatalogFiles = JSON.parse(
      (await fsPromises.readFile(source)).toString()
    );

    // Extract rule in template
    const answer = template.messages[1].content;
    const answerRules = extractAnswerRule(answer);
    if (answerRules.length == 0) {
      progress.log(`Finish ${source}, no answer rule is found`);
      continue;
    }

    template.testResult = [];
    for (const rule of answerRules) {
      await retry(
        async () => {
          const response = await nodeFetch(target, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              facts: template.facts.map((fact) => ({
                name: fact.name,
                content: fact.content,
              })),
              rule: {
                name: template.rules[0].name,
                content: rule,
              },
            }),
          });
          const { result } = (await response.json()) as any;
          template.testResult?.push({
            code: "```datalog\n" + rule + "\n```",
            actual: result,
            pass: checkResult(template.expected[0].content, result),
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

function extractAnswerRule(answer: string) {
  const PATTERN = /```(?:.*?)(?:\n|$)/gm;
  const matches = [...answer.matchAll(PATTERN)];
  const result: string[] = [];
  for (let i = 0; i < matches.length; i += 2) {
    const match = matches[i];
    if (match.index) {
      const next = matches[i + 1]?.index ?? answer.length;
      result.push(answer.substring(match.index + match[0].length, next - 1));
    }
  }
  return result;
}

function compare(row1: string[], row2: string[]) {
  if (row1.length !== row2.length) return row1.length - row2.length;
  for (let i = 0; i < row1.length; i++) {
    if (row1[i] !== row2[i]) return row1[i].localeCompare(row2[i]);
  }
  return 0;
}

function checkResult(expected: string, actual: string) {
  const expectedList = expected
    .split(/\r?\n/)
    .map((row) => row.split(/\s+/))
    .filter((row) => row && row[0]?.length > 0)
    .sort(compare);
  const actualList = actual
    .split(/\r?\n/)
    .map((row) => row.split(/\s+/))
    .filter((row) => row && row[0]?.length > 0)
    .sort(compare);
  if (expectedList.length !== actualList.length) return false;
  for (let i = 0; i < expectedList.length; i++) {
    const row1 = expectedList[i];
    const row2 = actualList[i];
    if (row1.length !== row2.length) return false;
    for (let j = 0; j < row1.length; j++) {
      if (row1[j] !== row2[j]) return false;
    }
  }
  return true;
}

export default CommandTest;
