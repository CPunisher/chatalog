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
    <div
      class={classNames("w-full text-gray-800 border-b border-black/10", {
        "bg-gray-50": role === "system",
      })}
    >
      <div class="text-base whitespace-pre-wrap m-auto p-4 md:max-w-2xl md:py-6 lg:max-w-2xl xl:max-w-3xl">
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
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
