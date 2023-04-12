import classNames from "classnames";
import { FunctionalComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import ReportContext from "../context";
import "highlight.js/styles/atom-one-dark.css";
import MessageItem from "../components/MessageItem";
import useHighlightCode from "../hooks/useHighlightCode";

interface MessageProps {
  content: string;
  role: "system" | "user";
}

const Message: FunctionalComponent<MessageProps> = ({ content, role }) => {
  const htmlContent = useHighlightCode(content);
  return (
    <MessageItem className={classNames({ "bg-gray-50": role === "system" })}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </MessageItem>
  );
};

const Conversation: FunctionalComponent = () => {
  const { current } = useContext(ReportContext) || {};

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
      <div class="w-full h-32 md:h-48" />
    </div>
  );
};

export default Conversation;
