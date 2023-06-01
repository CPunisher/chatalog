export interface ChartDataEntry {
  templateName: string;
  value: number;
  count: number;
  total: number;
}

export type ChartData = Array<ChartDataEntry>;
