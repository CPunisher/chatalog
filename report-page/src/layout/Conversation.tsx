import classNames from "classnames";
import { FunctionalComponent } from "preact";
import { useContext } from "preact/hooks";
import ReportContext from "../context";
import "highlight.js/styles/atom-one-dark.css";
import MessageItem from "../components/MessageItem";
import { ConvMessage } from "@chatalog/interface/commons";
import { useAutoHiglightCode } from "../hooks/useHighlightCode";
import { useParams } from "react-router-dom";

const Message: FunctionalComponent<ConvMessage> = ({ content, role }) => {
  const htmlContent = useAutoHiglightCode(content);
  return (
    <MessageItem className={classNames({ "bg-gray-50": role === "system" })}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </MessageItem>
  );
};

const Conversation: FunctionalComponent = () => {
  const { id = "0" } = useParams();
  const { data } = useContext(ReportContext) || {};
  const current = data?.[parseInt(id)];
  if (!current) {
    return null;
  }

  return (
    <div class="flex h-full flex-col overflow-auto">
      {current.messages.map((message, index) => (
        <Message
          content={message.content}
          role={index % 2 ? "system" : "user"}
        />
      ))}
    </div>
  );
};

export default Conversation;
