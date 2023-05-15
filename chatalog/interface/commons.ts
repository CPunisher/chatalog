export interface ConvMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface TestResult {
  code: string;
  expected: string[];
  actual: string[];
  pass: boolean;
}

export interface Module<T> {
  name: string;
  messages: ConvMessage[];
  testResult: TestResult[];
  data: T;
}

export type ModuleType = "souffle" | "string-trans";
