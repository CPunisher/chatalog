
module.exports = function ({ facts, expected, rules }) {
  const lines = [];
  for (const fact of facts) {
    lines.push(`Here are facts of relation ${fact.name}:`);
    lines.push(fact.content.replace(/\t/g, ", "));
  }

  const exp = expected[0];
  lines.push(`Please generate some rules that derive the following facts of relation ${exp.name}`);
  lines.push(exp.content.replace(/\t/g, ", "));

  lines.push("");
  lines.push("By the way, there is also declarations for relations above: ");
  lines.push("```");
  lines.push(rules[0].content);
  lines.push("```");

  // Key
  lines.push("Please describe the above mentioned relations in natural language");
  // lines.push("Let's work this out in a step by step way to be sure we have the right answer");
  lines.push("");
  return lines.join("\n");
}