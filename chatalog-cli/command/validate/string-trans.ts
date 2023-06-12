import { StringTransData } from "../../../chatalog/interface/string-trans";
import { request } from "@chatalog/network";
import {
  RequestValidateStringTrans,
  ResponseValidate,
} from "@chatalog/network/interface";
import { ValidateConfig } from "./interface";

const StringTrans: ValidateConfig<StringTransData> = {
  codeExtractor: (messages) => {
    const codes: string[] = [];
    for (const message of messages) {
      const PATTERN = /```(?:.*?)(?:\n|$)/gm;
      const matches = [...message.matchAll(PATTERN)];
      for (let i = 0; i < matches.length; i += 2) {
        const match = matches[i];
        if (match.index !== undefined) {
          const next = matches[i + 1]?.index ?? message.length;
          const code = message.substring(
            match.index + match[0].length,
            next - 1
          );
          codes.push(code);
        }
      }
    }
    const noTestCodes = codes.map(code => {
      let lastReturn = 0;
      const lines = code.split('\n');
      for (const [index, line] of lines.entries()) {
        if (line.includes('return ')) {
          lastReturn = index;
        }
      }
      return lines.slice(0, lastReturn + 1).join('\n');
    });
    return noTestCodes;
  },
  doValidate: async (target, code, module) => {
    const functionName = code.match(/def (\w*)/)?.[1];
    if (!functionName) {
      return null;
    }

    const { result } = await request<
      RequestValidateStringTrans,
      ResponseValidate<[string, string][]>
    >(target, {
      code,
      caller: functionName,
      data: module.data,
    });

    const passId = checkResult(module.data.examples, result);
    return {
      code: "```\n" + code + "\n```",
      expected: module.data.examples.map((r) => r[1]),
      actual: result.map((r) => `${r[0]}###${r[1]}`),
      passId,
      pass: passId.length === module.data.examples.length,
    };
  },
};

function checkResult(examples: [string, string][], result: [string, string][]) {
  const passId: number[] = [];
  for (const [index, [input, output]] of result.entries()) {
    const truth = examples.find((pair) => pair[0] === input)?.[1];
    if (truth === output) {
      passId.push(index);
    }
  }
  return passId;
}

export default StringTrans;
