import { SouffleData } from "../../../chatalog/interface/souffle";
import { request } from "@chatalog/network";
import {
  RequestValidateSouffle,
  ResponseValidate,
} from "@chatalog/network/interface";
import { ValidateConfig } from "./interface";

const Souffle: ValidateConfig<SouffleData> = {
  codeExtractor: (messages) => {
    const codes: string[] = [];
    for (const message of messages) {
      const PATTERN = /```(?:.*?)(?:\n|$)/gm;
      const matches = [...message.matchAll(PATTERN)];
      for (let i = 0; i < matches.length; i += 2) {
        const match = matches[i];
        if (match.index) {
          const next = matches[i + 1]?.index ?? message.length;
          codes.push(
            message.substring(match.index + match[0].length, next - 1)
          );
        }
      }
    }
    return codes;
  },
  doValidate: async (url, code, module) => {
    const { result: actual } = await request<
      RequestValidateSouffle,
      ResponseValidate<string[]>
    >(url, {
      code,
      data: module.data,
    });

    const expected = module.data.expected.map((e) => e.content);
    const passArr = actual.map((_, index) =>
      expected[index] ? checkResult(expected[index], actual[index]) : false
    );

    return {
      code: "```\n" + code + "\n```",
      expected,
      actual,
      passId: passArr.filter((v) => v).map((_, index) => index),
      pass: expected.length === actual.length && passArr.every((v) => v),
    };
  },
};

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
export default Souffle;
