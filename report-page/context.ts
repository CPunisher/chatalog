import { createContext } from "preact";
import { GroupedDatalogFiles } from "../chatalog-cli/interface";

interface ReportContextProps {
  data: GroupedDatalogFiles[];
  current: GroupedDatalogFiles;
  setCurrent: (newCurrent: GroupedDatalogFiles) => void;
}

const ReportContext = createContext<ReportContextProps | null>(null);

export default ReportContext;
