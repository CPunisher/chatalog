export interface DatalogFile {
  name: string;
  base: string;
  content: string;
}

export interface GroupedDatalogFiles {
  facts: DatalogFile[];
  expected: DatalogFile[];
  rules: DatalogFile[];
}

export type TemplateFunction = (args: GroupedDatalogFiles) => string;
