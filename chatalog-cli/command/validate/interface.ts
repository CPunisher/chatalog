import {
  Module,
  ModuleType,
  TestResult,
} from "../../../chatalog/interface/commons";

export interface ValidateOptions {
  type: ModuleType;
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
