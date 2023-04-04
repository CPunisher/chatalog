import classNames from "classnames";
import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import MessageItem from "../components/MessageItem";
import ReportContext from "../context";

const File: FunctionalComponent = () => {
  const { current } = useContext(ReportContext) || {};

  if (!current) {
    return null;
  }

  const list = [
    ...current.rules.map((rule, i) => [
      `Rule[${i + 1}]: ${rule.name}`,
      rule.content,
    ]),
    ...current.facts.map((fact, i) => [
      `Fact[${i + 1}]: ${fact.name}`,
      fact.content,
    ]),
    ...current.expected.map((expected, i) => [
      `Expected[${i + 1}]: ${expected.name}`,
      expected.content,
    ]),
  ];

  return (
    <div className="flex h-full flex-col overflow-auto">
      {list.map(([prompt, content], index) => (
        <MessageItem className={classNames({ "bg-gray-50": index % 2 === 1 })}>
          <div className="py-1 font-bold">{prompt}</div>
          {content}
        </MessageItem>
      ))}
      <div class="w-full h-32 md:h-48" />
    </div>
  );
};

export default File;
