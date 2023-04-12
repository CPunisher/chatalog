import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import ReportContext from "../context";
import { GroupedDatalogFiles } from "../../chatalog-cli/interface";

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
      } else if (testResult.some((r) => !r.actual.includes("syntax error"))) {
        // 存在一个不是语法错误的 false case
        summaryData.unexpectedCase++;
        summaryData.unexpectedList.push(entry);
      } else if (testResult.some((r) => r.actual.includes("syntax error"))) {
        // 语法错误
        summaryData.syntaxCase++;
        summaryData.syntaxList.push(entry);
      }
    }
  }
  return summaryData;
}

const Summary: FunctionalComponent = () => {
  const { data } = useContext(ReportContext) || {};
  const summaryData = summary(data ?? []);

  return (
    <div>
      <div>
        <span>正确用例/总用例: </span>
        <span>
          {summaryData.trueCase} / {summaryData.total}
        </span>
      </div>
      <div>
        <span>正确率:</span>
        <span>
          {((summaryData.trueCase / summaryData.total) * 100).toFixed(2)}%
        </span>
        <ul>
          {summaryData.trueList.map((e) => (
            <li>{e.name}</li>
          ))}
        </ul>
      </div>
      {/* 列表 */}
      <div>
        <span>运行结果不一致</span>
        <span>{summaryData.unexpectedCase}</span>
        <ul>
          {summaryData.unexpectedList.map((e) => (
            <li>{e.name}</li>
          ))}
        </ul>
      </div>
      {/* 列表 */}
      <div>
        <span>空代码</span>
        <span>{summaryData.emptyCase}</span>
        <ul>
          {summaryData.emptyList.map((e) => (
            <li>{e.name}</li>
          ))}
        </ul>
      </div>
      {/* 列表 */}
      <div>
        <span>语法错误:</span>
        <span>{summaryData.syntaxCase}</span>
        <ul>
          {summaryData.syntaxList.map((e) => (
            <li>{e.name}</li>
          ))}
        </ul>
      </div>
      {/* 列表 */}
    </div>
  );
};

export default Summary;
