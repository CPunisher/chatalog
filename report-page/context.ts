import { createContext } from "preact";
import { Module, ModuleType } from "@chatalog/interface/commons";

export type PageMode = "item" | "test summary";
export interface ReportContextProps<D> {
  type: ModuleType;
  data: Module<D>[];
  mode: PageMode;
  current: Module<D>;
  setCurrent: (newCurrent: Module<D> | PageMode) => void;
}

const ReportContext = createContext<ReportContextProps<unknown> | null>(null);

export default ReportContext;
