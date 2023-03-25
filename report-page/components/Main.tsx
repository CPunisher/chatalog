import classNames from "classnames";
import { FunctionalComponent, VNode } from "preact";
import { useState } from "preact/hooks";
import { GroupedDatalogFiles } from "../../chatalog-cli/interface";
import ReportContext from "../context";
import Conversation from "./Conversation";
import File from "./File";
import Result from "./Result";
import Sidebar from "./Sidebar";

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
  const [current, setCurrent] = useState(data[0]);
  const [tab, setTab] = useState<TabType>("conversation");

  return (
    <ReportContext.Provider
      value={{
        data,
        current,
        setCurrent,
      }}
    >
      <div class="overflow-hidden w-full h-full">
        <Sidebar />
        <div class="pl-[260px]">
          <Tabs
            tabs={TAB_TYPES}
            tab={tab}
            setTab={setTab}
            slots={[<Conversation />, <File />, <Result />]}
          />
        </div>
      </div>
    </ReportContext.Provider>
  );
};

export default Main;
