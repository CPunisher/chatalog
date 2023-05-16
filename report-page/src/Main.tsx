import classNames from "classnames";
import { FunctionalComponent, VNode } from "preact";
import ReportContext from "./context";
import Conversation from "./layout/Conversation";
import File from "./layout/File";
import Result from "./layout/Result";
import Summary from "./layout/Summary";
import Sidebar from "./components/Sidebar";
import { useContext, useState } from "preact/hooks";

type TabType = "conversation" | "file" | "result";

interface TabsProps {
  tabs: Record<TabType, { title: string; content: VNode }>;
  tab: TabType;
  setTab: (newTab: TabType) => void;
}

const Tabs: FunctionalComponent<TabsProps> = ({ tabs, tab, setTab }) => {
  return (
    <>
      <div class="w-full h-10 border-b border-black/10">
        <div class="w-full h-full flex justify-center items-center">
          {Object.entries(tabs).map(([type, tabObj]) => (
            <div
              class={classNames("mx-4 text-sm text-zinc-600 cursor-pointer", {
                "text-black font-bold": type === tab,
              })}
              onClick={() => setTab(type as TabType)}
            >
              {tabObj.title}
            </div>
          ))}
        </div>
      </div>
      {tabs[tab].content}
    </>
  );
};

const Main: FunctionalComponent = () => {
  const [tab, setTab] = useState<TabType>("conversation");
  const { mode } = useContext(ReportContext) || {};
  return (
    <div class="overflow-hidden w-full h-full">
      <Sidebar />
      <div class="pl-[260px]">
        {mode === "item" && (
          <Tabs
            tabs={{
              conversation: { title: "对话", content: <Conversation /> },
              file: { title: "原始文件", content: <File /> },
              result: { title: "运行结果", content: <Result /> },
            }}
            tab={tab}
            setTab={setTab}
          />
        )}
        {mode === "test summary" && <Summary />}
      </div>
    </div>
  );
};

export default Main;
