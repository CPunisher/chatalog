import { LanguageFn } from "highlight.js";
const languageFn: LanguageFn = (hljs) => {
  const PREPROCESSOR = {
    scope: "meta",
    begin: /#\s*[a-z]+\b/,
    end: /$/,
  };

  const STRING = {
    scope: "string",
    begin: '"',
    end: '"',
    contains: [
      {
        begin: /\\./,
      },
    ],
  };

  const RULE = {
    scope: {
      1: "title.function",
    },
    match: [/\w+/, /\s*\(/],
  };

  const TYPE = {
    scope: {
      1: "keyword",
      3: "type",
    },
    match: [/(\.(symbol_|number_))?type/, /\s*/, /\w+/],
  };

  const DECL = {
    scope: {
      3: "operator",
      5: "type",
    },
    match: [/\w+/, /\s*/, /:/, /\s*/, /\w+/],
  };

  const KEYWORDS = {
    scope: { 1: "keyword", 3: "title.function" },
    match: [
      /\.(type|symbol_type|number_type|decl|input|output)?/,
      /\s*/,
      /\w+/,
    ],
  };

  const OPERATOR = {
    scope: "operator",
    match: /=|\||:-|\+|-|\*|\//,
  };

  return {
    name: "Souffle Datalog",
    contains: [
      STRING,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      PREPROCESSOR,
      RULE,
      TYPE,
      DECL,
      hljs.NUMBER_MODE,
      KEYWORDS,
      OPERATOR,
    ],
  };
};

export default languageFn;
