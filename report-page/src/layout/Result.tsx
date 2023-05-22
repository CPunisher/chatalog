import { FunctionalComponent } from "preact";
import { useContext, useMemo } from "preact/hooks";
import MessageItem from "../components/MessageItem";
import ReportContext from "../context";
import classNames from "classnames";
import { TestResult } from "@chatalog/interface/commons";
import { useAutoHiglightCode } from "../hooks/useHighlightCode";

const SingleResult: FunctionalComponent<{ result: TestResult }> = ({
  result,
}) => {
  const htmlContent = useAutoHiglightCode(result.code);
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
      {result.actual
        .map((actual) => actual.split("###"))
        .map(([input, output], index) => {
          const expected = result.expected[index];
          if (expected === output) {
            return (
              <div>
                {input}, {output}, {expected}
              </div>
            );
          }
          return (
            <div class="text-red-600">
              <span>{input}</span>
              <span>{"\t"}</span>
              <span>{output || "「空」"}</span>
              <span>{"\t"}</span>
              <span>{expected}</span>
            </div>
          );
        })}
      {result.pass.toString()}
    </>
  );
};

const Result: FunctionalComponent = () => {
  const { current } = useContext(ReportContext) || {};

  if (!current) {
    return null;
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      {current.testResult.map((result, index) => (
        <MessageItem className={classNames({ "bg-gray-50": index % 2 === 1 })}>
          <SingleResult result={result} />
        </MessageItem>
      ))}
    </div>
  );
};

export default Result;
