import { useEffect, useState } from "preact/hooks";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSouffle from "../utils/rehype-souffle";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import souffle from "../utils/language-souffle";

export default function useHighlightCode(content: string) {
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
  return htmlContent;
}
