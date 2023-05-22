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

export function singleValidate(entry: Module<unknown>): ValidationResult {
  const { testResult } = entry;
  if (testResult.some((r) => r.pass)) return ValidationResult.PASS;
  else {
    if (!testResult.length) return ValidationResult.EMPTY_ERROR;
    if (testResult.some((r) => !isError(r.actual)))
      return ValidationResult.WRONG_ERROR;
    if (testResult.some((r) => isError(r.actual)))
      return ValidationResult.SYNTAX_ERROR;
  }
  throw new Error("unreachable");
}
