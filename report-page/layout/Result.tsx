import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import MessageItem from "../components/MessageItem";
import ReportContext from "../context";

const Result: FunctionalComponent = () => {
  const { current } = useContext(ReportContext) || {};

  if (!current) {
    return null;
  }

  return (
    <div className="flex h-full flex-col overflow-auto">
      <MessageItem>{current.testResult?.actual}</MessageItem>
      <div class="w-full h-32 md:h-48" />
    </div>
  );
};

export default Result;
