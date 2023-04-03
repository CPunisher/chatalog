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
}

export type TemplateFunction = (args: GroupedDatalogFiles) => string;
