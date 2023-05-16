import { useContext, useEffect, useMemo, useState } from "preact/hooks";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeLanguage from "../utils/rehype-language";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import souffle from "../utils/language-souffle";
import ReportContext from "../context";

export function useAutoHiglightCode(content: string) {
  const { type } = useContext(ReportContext) || {};
  const language: string = useMemo(() => {
    switch (type) {
      case "souffle":
        return "souffle";
      case "string-trans":
        return "python";
    }
    return "";
  }, [type]);
  return useHighlightCode(content, language);
}

export function useHighlightCode(content: string, language: string) {
  const [htmlContent, setHtmlContent] = useState("");
  useEffect(() => {
    unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeLanguage(language))
      .use(rehypeHighlight, { languages: { souffle } })
      .use(rehypeStringify)
      .process(content)
      .then((file) => setHtmlContent(String(file)));
  }, [content, language]);
  return htmlContent;
}
