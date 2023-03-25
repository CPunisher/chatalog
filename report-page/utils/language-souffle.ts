import { LanguageFn } from "highlight.js";
const languageFn: LanguageFn = (hljs) => {
  return {
    name: "Souffle Datalog",
    contains: [],
  };
};

export default languageFn;
