import { Module, TestResult } from "../../interface/commons";
import { ResponseValidate } from "../../network/interface";

export type ValidateType = "souffle" | "string-trans";

export interface ValidateOptions {
  type: ValidateType;
  target: string;
  outDir: string;
}

export interface ValidateConfig<D> {
  codeExtractor: (messages: string[]) => string[];
  doValidate: (
    target: string,
    code: string,
    module: Module<D>
  ) => Promise<TestResult | null>;
}