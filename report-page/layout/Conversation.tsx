import classNames from "classnames";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSouffle from "../utils/rehype-souffle";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { FunctionalComponent } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import ReportContext from "../context";
import souffle from "../utils/language-souffle";
import "highlight.js/styles/atom-one-dark.css";
import MessageItem from "../components/MessageItem";

interface MessageProps {
  content: string;
  role: "system" | "user";
}

const Message: FunctionalComponent<MessageProps> = ({ content, role }) => {
  const [htmlContent, setHtmlContent] = useState("");
  useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSouffle)
      .use(rehypeHighlight, { languages: { souffle } })
      .use(rehypeStringify)
      .process(content)
      .then((file) => setHtmlContent(String(file)));
  }, [content]);

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