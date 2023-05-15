import unifiedTypes from "unified";
import { Element } from "hast";
import { visit } from "unist-util-visit";
import { Test } from "unist-util-is";

function preElementSelector(): Test {
  return (node) =>
    !!node &&
    node.type === "element" &&
    "tagName" in node &&
    node.tagName === "code";
}

function rehypeLanguage(language: string): unifiedTypes.Plugin<[], Element> {
  return () => (tree) => {
    visit<Element, Test>(tree, preElementSelector(), function (node) {
      if ("properties" in node && node.properties) {
        node.properties.className = [`language-${language}`];
      }
    });
  };
}

export default rehypeLanguage;
