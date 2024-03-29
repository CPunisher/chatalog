import { StringTransData } from "@chatalog/interface/string-trans";
import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import { useParams } from "react-router-dom";
import MessageItem from "../../components/MessageItem";
import ReportContext, { ReportContextProps } from "../../context";

const StringTransFile: FunctionalComponent = () => {
  const { id = "0" } = useParams();
  const { data } = (useContext(ReportContext) ||
    {}) as ReportContextProps<StringTransData>;
  const current = data?.[parseInt(id)];

  if (!current) {
    return null;
  }

  return (
    <div className="flex h-[calc(100%-40px)] flex-col overflow-auto">
      <MessageItem>
        {current.data.examples
          .map(([input, output]) => `${input}, ${output}`)
          .join("\n")}
      </MessageItem>
    </div>
  );
};

export default StringTransFile;
