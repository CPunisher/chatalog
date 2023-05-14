import { createContext } from "preact";
import { GroupedDatalogFiles } from "../chatalog/interface";

export type PageMode = "item" | "test summary";
export interface ReportContextProps {
  data: GroupedDatalogFiles[];
  mode: PageMode;
  current: GroupedDatalogFiles;
  setCurrent: (newCurrent: GroupedDatalogFiles | PageMode) => void;
}

const ReportContext = createContext<ReportContextProps | null>(null);

export default ReportContext;
