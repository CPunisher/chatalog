import { Module } from "@chatalog/interface/commons";

export enum ValidationResult {
  PASS,
  EMPTY_ERROR,
  SYNTAX_ERROR,
  WRONG_ERROR,
}

function isError(out: string[]) {
  return ["Error:", "Traceback"].some((p) => out.some((o) => o.includes(p)));
}

export function singleValidate(
  entry: Module<unknown>
): [ValidationResult, number, number] {
  const { testResult } = entry;
  // 存在 pass
  const passIndex = testResult.findIndex((r) => r.pass);
  if (passIndex > -1) return [ValidationResult.PASS, 1, passIndex];
  else {
    // 空结果
    if (!testResult.length) return [ValidationResult.EMPTY_ERROR, 0, -1];

    // 取最大正确率
    const [max, maxIndex] = testResult.reduce(
      ([prevMax, prevIndex], current, currentIndex) => {
        const r = current.passId.length / current.expected.length;
        if (r > prevIndex) return [r, currentIndex];
        return [prevMax, prevIndex];
      },
      [0, -1]
    );

    if (!isError(testResult[maxIndex].actual)) {
      return [ValidationResult.WRONG_ERROR, max, maxIndex];
    }
    return [ValidationResult.SYNTAX_ERROR, max, maxIndex];
  }
}
