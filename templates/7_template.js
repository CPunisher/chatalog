
module.exports = function ({ data }) {
  const { facts, expected, rules } = data;
  const lines = [];

  for (const fact of facts) {
    lines.push(`Here are facts of relation ${fact.name}:`);
    lines.push(
      fact.content.replace(/\t/g, ", ").split("\n").slice(0, 10).join("\n")
    );
    lines.push("");
  }

  const exp = expected[0];
  lines.push(
    `Please finish the souffle rules that derive the following facts of relation ${exp.name} based on the facts above.`
  );
  lines.push(
    exp.content.replace(/\t/g, ", ").split("\n").slice(0, 10).join("\n")
  );


  lines.push("");
  lines.push("```");
  lines.push(rules[0].content);
  lines.push("");
  lines.push("// Write your rules here");
  lines.push("```");
  return lines.join('\n');
}