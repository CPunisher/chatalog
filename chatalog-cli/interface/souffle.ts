export interface SouffleFile {
  name: string;
  base: string;
  content: string;
}

export interface SouffleData {
  facts: SouffleFile[];
  expected: SouffleFile[];
  rules: SouffleFile[];
}
