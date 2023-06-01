import { ValidationResult } from "@chatalog/utils/validator";

export interface ChartDataEntry {
  templateName: string;
  category: ValidationResult;
  value: number;
  count: number;
  total: number;
}

export type ChartData = Array<ChartDataEntry>;
