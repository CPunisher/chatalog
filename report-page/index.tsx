import { createContext, render } from "preact";
import { useContext, useState } from "preact/hooks";
import { GroupedDatalogFiles } from "../chatalog-cli/interface";
import "./index.css";

interface ReportContextProps {
  data: GroupedDatalogFiles[];
  current: GroupedDatalogFiles;
  setCurrent: (newCurrent: GroupedDatalogFiles) => void;
}

const ReportContext = createContext<ReportContextProps | null>(null);

const Sidebar = () => {
  const { data = [], current, setCurrent } = useContext(ReportContext) || {};
  return (
    <div class="dark hidden bg-gray-900 p-2 space-y-1 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col">
      <div class="flex flex-col gap-2 text-gray-100 text-sm">
        {data.map((group) => (
          <a class="flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-[#2A2B32] cursor-pointer break-all hover:pr-4 group">
            <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
              {group.rules[0].name}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const Conversation = () => {
  return <div>Conversation</div>;
};

function renderReports(parentNode: Element, data: GroupedDatalogFiles[]) {
  const [current, setCurrent] = useState(data[0]);
  const Page = (
    <div class="overflow-hidden w-full h-full">
      <Sidebar />
      <Conversation />
    </div>
  );
  render(
    <ReportContext.Provider
      value={{
        data,
        current,
        setCurrent,
      }}
    >
      {Page}
    </ReportContext.Provider>,
    parentNode
  );
}

export default renderReports;
