import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import MessageItem from "../components/MessageItem";
import ReportContext from "../context";
import classNames from "classnames";
import useHighlightCode from "../hooks/useHighlightCode";
import { TestResult } from "../../chatalog-cli/interface";

interface SingleResultProps {
  result: TestResult;
}

const SingleResult: FunctionalComponent<SingleResultProps> = ({ result }) => {
  const htmlContent = useHighlightCode(result.code);

  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: htmlContent }} />
      {result.actual}
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
      {current.testResult?.map((result, index) => (
        <MessageItem className={classNames({ "bg-gray-50": index % 2 === 1 })}>
          <SingleResult result={result} />
        </MessageItem>
      ))}
      <div class="w-full h-32 md:h-48" />
    </div>
  );
};

export default Result;
