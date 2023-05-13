module.exports = function ({ data }) {
  const { facts, expected, rules } = data;
  const lines = [];
  for (const fact of facts) {
    lines.push(`Here are facts of relation ${fact.name}:`);
    lines.push(fact.content);
  }

  const exp = expected[0];
  lines.push(`Please generate some rules that derive the following facts of relation ${exp.name}`);
  lines.push(exp.content);

  lines.push("");
  lines.push("By the way, there is also declarations for relations above: ");
  lines.push("```");
  lines.push(rules[0].content);
  lines.push("```");

  // Key
  lines.push("Please generate a complete interpretable souffle datalog code with as much intermediate relation as possible");
  lines.push("");
  return lines.join("\n");
}