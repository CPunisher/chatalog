import { createContext } from "preact";
import { Module, ModuleType } from "@chatalog/interface/commons";

export interface ReportContextProps<D> {
  type: ModuleType;
  data: Module<D>[];
}

const ReportContext = createContext<ReportContextProps<unknown> | null>(null);

export default ReportContext;
