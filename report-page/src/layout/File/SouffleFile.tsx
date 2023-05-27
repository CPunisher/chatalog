import { SouffleData } from "@chatalog/interface/souffle";
import classNames from "classnames";
import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import { useParams } from "react-router-dom";
import MessageItem from "../../components/MessageItem";
import ReportContext, { ReportContextProps } from "../../context";

const SouffleFile: FunctionalComponent = () => {
  const { id = "0" } = useParams();
  const { data } = (useContext(ReportContext) ||
    {}) as ReportContextProps<SouffleData>;
  const current = data?.[parseInt(id)];

  if (!current) {
    return null;
  }

  const list = [
    ...current.data.rules.map((rule, i) => [
      `Rule[${i + 1}]: ${rule.name}`,
      rule.content,
    ]),
    ...current.data.facts.map((fact, i) => [
      `Fact[${i + 1}]: ${fact.name}`,
      fact.content,
    ]),
    ...current.data.expected.map((expected, i) => [
      `Expected[${i + 1}]: ${expected.name}`,
      expected.content,
    ]),
  ];

  return (
    <div className="flex h-[calc(100%-40px)] flex-col overflow-auto">
      {list.map(([prompt, content]) => (
        <MessageItem className="odd:bg-gray-50">
          <div className="py-1 font-bold">{prompt}</div>
          {content}
        </MessageItem>
      ))}
    </div>
  );
};

export default SouffleFile;
