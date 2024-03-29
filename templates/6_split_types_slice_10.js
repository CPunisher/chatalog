module.exports = function ({ data }) {
  const { facts, expected, rules } = data;
  const lines = [];
  for (const fact of facts) {
    lines.push(`Here are facts of relation ${fact.name}:`);
    lines.push(
      fact.content.replace(/\t/g, ", ").split("\n").slice(0, 10).join("\n")
    );
  }

  const exp = expected[0];
  lines.push(
    `Please generate some rules that derive the following facts of relation ${exp.name}`
  );
  lines.push(
    exp.content.replace(/\t/g, ", ").split("\n").slice(0, 10).join("\n")
  );

  lines.push("");
  lines.push("By the way, there is also declarations for relations above: ");
  lines.push("```");
  lines.push(rules[0].content);
  lines.push("```");

  // Key
  lines.push("Please generate a complete interpretable souffle datalog code.");
  lines.push(
    "Pay attention not to declare multiple types in one line like `.type A, B`. Instead splits them into multiple lines one by one like `.type A .type B`"
  );
  lines.push(
    "Let's work this out in a step by step way to be sure we have the right answer"
  );
  lines.push("");
  return lines.join("\n");
};
