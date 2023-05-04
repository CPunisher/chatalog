export interface DatalogFile {
  name: string;
  base: string;
  content: string;
}

export interface ConvMessage {
  content: string;
}

export interface GroupedDatalogFiles {
  name: string;
  facts: DatalogFile[];
  expected: DatalogFile[];
  rules: DatalogFile[];
  messages: ConvMessage[];
  testResult?: TestResult[];
}

export type TemplateFunction = (args: any) => string;

export interface TestResult {
  code: string;
  actual: string;
  pass: boolean;
}

export interface NormalFiles {
  name: string;
  examples: [string, string][];
  messages: ConvMessage[];
  testResult?: TestResult[];
}
