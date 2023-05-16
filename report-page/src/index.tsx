import { FunctionalComponent, render } from "preact";
import Main from "./Main";
import "./index.css";
import { Module, ModuleType } from "@chatalog/interface/commons";
import ReportContext, { PageMode, ReportContextProps } from "./context";
import { useCallback, useState } from "preact/hooks";

const App: FunctionalComponent<{
  type: ModuleType;
  data: Module<unknown>[];
}> = ({ type, data }) => {
  const [mode, setMode] = useState<PageMode>("item");
  const [current, _setCurrent] = useState(data[0]);
  const setCurrent: ReportContextProps<unknown>["setCurrent"] = useCallback(
    (newCurrent) => {
      if (typeof newCurrent === "string") {
        setMode(newCurrent);
      } else {
        setMode("item");
        _setCurrent(newCurrent);
      }
    },
    []
  );

  return (
    <ReportContext.Provider
      value={{
        type,
        data,
        mode,
        current,
        setCurrent,
      }}
    >
      <Main />
    </ReportContext.Provider>
  );
};

function renderReports(
  parentNode: Element,
  type: ModuleType,
  data: Module<unknown>[]
) {
  render(<App type={type} data={data} />, parentNode);
}

export default renderReports;
