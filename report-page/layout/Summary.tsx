import { FunctionalComponent, VNode } from "preact";
import { useContext, useState } from "preact/hooks";
import ReportContext from "../context";
import { GroupedDatalogFiles } from "../../chatalog-cli/interface";
import classNames from "classnames";

interface SummaryData {
  total: number;
  trueCase: number;
  trueList: GroupedDatalogFiles[];
  // false case
  unexpectedCase: number;
  unexpectedList: GroupedDatalogFiles[];
  emptyCase: number;
  emptyList: GroupedDatalogFiles[];
  syntaxCase: number;
  syntaxList: GroupedDatalogFiles[];
}

function summary(data: GroupedDatalogFiles[]): SummaryData {
  const summaryData: SummaryData = {
    total: data.length,
    trueCase: 0,
    trueList: [],

    unexpectedCase: 0,
    unexpectedList: [],
    emptyCase: 0,
    emptyList: [],
    syntaxCase: 0,
    syntaxList: [],
  };

  for (const entry of data) {
    const { testResult } = entry;
    if (testResult?.some((r) => r.pass)) {
      summaryData.trueCase++;
      summaryData.trueList.push(entry);
    } else {
      if (!testResult?.length) {
        // 空结果
        summaryData.emptyCase++;
        summaryData.emptyList.push(entry);
      } else if (testResult.some((r) => !r.actual.includes("Error:"))) {
        // 存在一个不是语法错误的 false case
        summaryData.unexpectedCase++;
        summaryData.unexpectedList.push(entry);
      } else if (testResult.some((r) => r.actual.includes("Error:"))) {
        // 语法错误
        summaryData.syntaxCase++;
        summaryData.syntaxList.push(entry);
      }
    }
  }
  return summaryData;
}

interface CollapseProps {
  className?: string;
}

const Collapse: FunctionalComponent<CollapseProps> = ({
  className,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className={classNames("", className)}>
      <div
        className="font-bold cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "点击展开折叠列表" : "点击收起折叠列表"}
      </div>
      <div className={classNames({ hidden: collapsed })}>{children}</div>
    </div>
  );
};

const Summary: FunctionalComponent = () => {
  const { data } = useContext(ReportContext) || {};
  const summaryData = summary(data ?? []);

  return (
    <div className="w-full space-y-4">
      <div className="m-auto p-4 md:max-w-2xl lg:max-w-3xl">
        <span>正确用例/总用例: </span>
        <span>
          {summaryData.trueCase} / {summaryData.total}
        </span>
      </div>
      <div className="m-auto p-4 md:max-w-2xl lg:max-w-3xl">
        <span>正确率: </span>
        <span>
          {((summaryData.trueCase / summaryData.total) * 100).toFixed(2)}%
        </span>
        <Collapse>
          {summaryData.trueList.map((e) => (
            <li>{e.name}</li>
          ))}
        </Collapse>
      </div>
      <div className="m-auto p-4 md:max-w-2xl lg:max-w-3xl">
        <span>运行结果不一致: </span>
        <span>{summaryData.unexpectedCase}</span>
        <Collapse>
          {summaryData.unexpectedList.map((e) => (
            <li>{e.name}</li>
          ))}
        </Collapse>
      </div>
      <div className="m-auto p-4 md:max-w-2xl lg:max-w-3xl">
        <span>空结果: </span>
        <span>{summaryData.emptyCase}</span>
        <Collapse>
          {summaryData.emptyList.map((e) => (
            <li>{e.name}</li>
          ))}
        </Collapse>
      </div>
      <div className="m-auto p-4 md:max-w-2xl lg:max-w-3xl">
        <span>语法错误: </span>
        <span>{summaryData.syntaxCase}</span>
        <Collapse>
          {summaryData.syntaxList.map((e) => (
            <li>{e.name}</li>
          ))}
        </Collapse>
      </div>
    </div>
  );
};

export default Summary;
