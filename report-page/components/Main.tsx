import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import { GroupedDatalogFiles } from "../../chatalog-cli/interface";
import ReportContext from "../context";
import Conversation from "./Conversation";
import Sidebar from "./Sidebar";

interface MainProps {
  data: GroupedDatalogFiles[];
}

const Main: FunctionalComponent<MainProps> = ({ data }) => {
  const [current, setCurrent] = useState(data[0]);
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
        <Conversation />
      </div>
    </ReportContext.Provider>
  );
};

export default Main;
