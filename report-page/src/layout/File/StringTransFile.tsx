import { StringTransData } from "@chatalog/interface/string-trans";
import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import MessageItem from "../../components/MessageItem";
import ReportContext, { ReportContextProps } from "../../context";

const StringTransFile: FunctionalComponent = () => {
  const { current } = (useContext(ReportContext) ||
    {}) as ReportContextProps<StringTransData>;

  if (!current) {
    return null;
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <MessageItem>
        {current.data.examples
          .map(([input, output]) => `${input}, ${output}`)
          .join("\n")}
      </MessageItem>
    </div>
  );
};

export default StringTransFile;
