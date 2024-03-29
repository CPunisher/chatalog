import { FunctionComponent, FunctionalComponent } from "preact";
import { useContext, useState } from "preact/hooks";
import ReportContext from "../context";
import classNames from "classnames";
import { Module } from "@chatalog/interface/commons";
import { ValidationResult, singleValidate } from "@chatalog/utils/validator";
import { Link } from "react-router-dom";

interface SummaryEntry {
  path: string;
  name: string;
  accuracy: number;
}

interface SummaryData {
  total: number;
  trueCase: number;
  trueList: SummaryEntry[];
  // false case
  unexpectedCase: number;
  unexpectedList: SummaryEntry[];
  syntaxCase: number;
  syntaxList: SummaryEntry[];
  emptyCase: number;
  emptyList: SummaryEntry[];
}

function summary(data: Module<unknown>[]): SummaryData {
  const summaryData: SummaryData = {
    total: data.length,
    trueCase: 0,
    trueList: [],

    unexpectedCase: 0,
    unexpectedList: [],
    syntaxCase: 0,
    syntaxList: [],
    emptyCase: 0,
    emptyList: [],
  };

  for (const [index, entry] of data.entries()) {
    const [validationResult, accuracy] = singleValidate(entry);
    switch (validationResult) {
      case ValidationResult.PASS: {
        summaryData.trueCase++;
        summaryData.trueList.push({
          name: entry.name,
          accuracy: 1,
          path: index.toString(),
        });
        break;
      }
      case ValidationResult.EMPTY_ERROR: {
        // 空结果
        summaryData.emptyCase++;
        summaryData.emptyList.push({
          name: entry.name,
          accuracy: 0,
          path: index.toString(),
        });
        break;
      }
      case ValidationResult.WRONG_ERROR: {
        // 存在一个不是语法错误的 false case
        summaryData.unexpectedCase++;
        summaryData.unexpectedList.push({
          name: entry.name,
          accuracy,
          path: index.toString(),
        });
        break;
      }
      case ValidationResult.SYNTAX_ERROR: {
        // 语法错误
        summaryData.syntaxCase++;
        summaryData.syntaxList.push({
          name: entry.name,
          accuracy,
          path: index.toString(),
        });
        break;
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

const SummaryTable: FunctionComponent<{
  entries: SummaryEntry[];
}> = ({ entries }) => {
  return (
    <table class="block box-border my-3 w-full overflow-auto">
      <thead class="w-full">
        <tr>
          <th class="text-left px-3 py-2 border border-gray-300">测试用例</th>
          <th class="text-left px-3 py-2 border border-gray-300">用例正确率</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr class="odd:bg-gray-50">
            <td class="px-3 py-2 border border-gray-300">
              <Link to={`/${entry.path}/result`}>{entry.name}</Link>
            </td>
            <td class="px-3 py-2 border border-gray-300">
              {(entry.accuracy * 100).toFixed(3)}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
          <SummaryTable entries={summaryData.trueList} />
        </Collapse>
      </div>
      <div className="m-auto p-4 md:max-w-2xl lg:max-w-3xl">
        <span>运行结果不一致: </span>
        <span>{summaryData.unexpectedCase}</span>
        <Collapse>
          <SummaryTable entries={summaryData.unexpectedList} />
        </Collapse>
      </div>
      <div className="m-auto p-4 md:max-w-2xl lg:max-w-3xl">
        <span>空结果: </span>
        <span>{summaryData.emptyCase}</span>
        <Collapse>
          <SummaryTable entries={summaryData.emptyList} />
        </Collapse>
      </div>
      <div className="m-auto p-4 md:max-w-2xl lg:max-w-3xl">
        <span>语法错误: </span>
        <span>{summaryData.syntaxCase}</span>
        <Collapse>
          <SummaryTable entries={summaryData.syntaxList} />
        </Collapse>
      </div>
    </div>
  );
};

export default Summary;
