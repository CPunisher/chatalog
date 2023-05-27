import { FunctionalComponent } from "preact";
import { useContext, useMemo } from "preact/hooks";
import MessageItem from "../components/MessageItem";
import ReportContext from "../context";
import classNames from "classnames";
import { TestResult } from "@chatalog/interface/commons";
import { useAutoHiglightCode } from "../hooks/useHighlightCode";
import { useParams } from "react-router-dom";

const SingleResult: FunctionalComponent<{ result: TestResult }> = ({
  result,
}) => {
  const htmlContent = useAutoHiglightCode(result.code);
  return (
    <div class="space-y-4">
      <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
      <div>测试结果: {result.pass ? "✔" : "❌"}</div>
      <table class="block box-border my-3 w-full overflow-auto">
        <thead class="w-full">
          <tr>
            <th class="text-left px-3 py-2 border border-gray-300">Input</th>
            <th class="text-left px-3 py-2 border border-gray-300">Output</th>
            <th class="test-left px-3 py-2 border border-gray-300">Expected</th>
          </tr>
        </thead>
        <tbody>
          {result.actual
            .map((actual) => actual.split("###"))
            .map(([input, output], index) => {
              const expected = result.expected[index];
              return (
                <tr
                  class={classNames("odd:bg-gray-50", {
                    "text-red-600": expected !== output,
                  })}
                >
                  <td class="px-3 py-2 border border-gray-300">{input}</td>
                  <td class="px-3 py-2 border border-gray-300">
                    {output || "「空」"}
                  </td>
                  <td class="px-3 py-2 border border-gray-300">{expected}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

const Result: FunctionalComponent = () => {
  const { id = "0" } = useParams();
  const { data } = useContext(ReportContext) || {};
  const current = data?.[parseInt(id)];

  if (!current) {
    return null;
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      {current.testResult.map((result) => (
        <MessageItem className="even:bg-gray-50">
          <SingleResult result={result} />
        </MessageItem>
      ))}
    </div>
  );
};

export default Result;
