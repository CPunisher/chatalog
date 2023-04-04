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
    const answerRule = extractAnswerRule(answer);
    if (answerRule === null) {
      progress.log(`Finish ${source}, no answer rule is found`);
      continue;
    }

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
              content: answerRule,
            },
          }),
        });
        const { result, error } = (await response.json()) as any;
        template.testResult = {
          actual: result,
          pass: checkResult(template.expected[0].content, result),
        };
        fsPromises.writeFile(source, JSON.stringify(template, null, 2));
      },
      {
        retries,
        onRetry: (error) => {
          console.error(`Getting reply failed, retrying...`);
          console.error(error);
        },
      }
    );
    progress.log(`Finish ${source}`);
  }
}

function extractAnswerRule(answer: string) {
  const end = answer.lastIndexOf("```");
  const begin = answer.lastIndexOf("```", end - 1);
  if (begin >= 0 && end >= 0) {
    return answer
      .substring(begin + 3, end)
      .split("\n")
      .slice(1)
      .join("\n");
  }
  return null;
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
    .sort(compare);
  const actualList = actual
    .split(/\r?\n/)
    .map((row) => row.split(/\s+/))
    .sort(compare);
  if (expectedList.length !== actualList.length) return false;
  for (let i = 0; i < expectedList.length; i++) {
    const row1 = expectedList[i];
    const row2 = actualList[i];
    if (row1.length === row2.length) return false;
    for (let j = 0; j < row1.length; i++) {
      if (row1[j] !== row2[j]) return false;
    }
  }
  return true;
}

export default CommandTest;
