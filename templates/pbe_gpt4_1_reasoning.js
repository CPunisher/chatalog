module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("Generate a Python program as required so that they satisfiy the following input and output examples.");
  lines.push("```");
  for (const [index, example] of examples.slice(0, 10).entries()) {
    lines.push(`Input ${index}: "${example[0]}", Output ${index}: "${example[1]}"`);
  }
  lines.push("```");
  lines.push("Let's follow the steps below and think step by step.");
  lines.push("1. Generate ten another examples.");
  lines.push("2. Describe the pattern between these inputs and outputs.");
  lines.push("3. Complete the following python program.");
  lines.push("```python");
  lines.push("def func(input_string):")
  lines.push("  # Implement your program here.")
  lines.push("  ")
  lines.push("```");
  return lines.join("\n");
}