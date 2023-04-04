import classNames from "classnames";
import { FunctionalComponent, VNode } from "preact";
import { useCallback, useState } from "preact/hooks";
import { GroupedDatalogFiles } from "../chatalog-cli/interface";
import ReportContext, { PageMode, ReportContextProps } from "./context";
import Conversation from "./layout/Conversation";
import File from "./layout/File";
import Result from "./layout/Result";
import Summary from "./layout/Summary";
import Sidebar from "./components/Sidebar";

type TabType = "conversation" | "file" | "result";

const TAB_TYPES: Record<TabType, string> = {
  conversation: "Conversation",
  file: "Origin Files",
  result: "Test Result",
};

interface TabsProps {
  tabs: Record<TabType, string>;
  tab: TabType;
  setTab: (newTab: TabType) => void;
  slots: VNode[];
}

const Tabs: FunctionalComponent<TabsProps> = ({ tabs, tab, setTab, slots }) => {
  return (
    <>
      <div class="w-full h-10 border-b border-black/10">
        <div class="w-full h-full flex justify-center items-center">
          {Object.entries(tabs).map(([type, title]) => (
            <div
              class={classNames("mx-4 text-sm text-zinc-600 cursor-pointer", {
                "text-black font-bold": type === tab,
              })}
              onClick={() => setTab(type as TabType)}
            >
              {title}
            </div>
          ))}
        </div>
      </div>
      {slots[Object.keys(tabs).findIndex((t) => t === tab)]}
    </>
  );
};

interface MainProps {
  data: GroupedDatalogFiles[];
}

const Main: FunctionalComponent<MainProps> = ({ data }) => {
  const [mode, setMode] = useState<PageMode>("item");
  const [current, _setCurrent] = useState(data[0]);
  const [tab, setTab] = useState<TabType>("conversation");
  const setCurrent: ReportContextProps["setCurrent"] = useCallback(
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
        data,
        mode,
        current,
        setCurrent,
      }}
    >
      <div class="overflow-hidden w-full h-full">
        <Sidebar />
        <div class="pl-[260px]">
          {mode === "item" && (
            <Tabs
              tabs={TAB_TYPES}
              tab={tab}
              setTab={setTab}
              slots={[<Conversation />, <File />, <Result />]}
            />
          )}
          {mode === "test summary" && <Summary />}
        </div>
      </div>
    </ReportContext.Provider>
  );
};

export default Main;
