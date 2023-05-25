module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("Complete the following python function so that it satisfies the input and output.");
  lines.push("```python");
  lines.push("def func(input_string):")
  lines.push("  \"\"\"")
  lines.push("  Decompose the predure into muiltiple steps and write to this comment block.")
  lines.push("  Try to be consistent in the syntax of each step description, starting with a verb and no more than one sentence")
  lines.push("  \"\"\"")
  lines.push("  ")
  lines.push("  # Implement your program here.")
  lines.push("  ")
  lines.push("```");
  lines.push("Each of the following lines is an input: ")
  for (const example of examples.slice(0, 10)) {
    lines.push(`${example[0]}`);
  }
  lines.push("")
  lines.push("Each of the following lines is an corresponding output: ")
  for (const example of examples.slice(0, 10)) {
    lines.push(`${example[1]}`);
  }
  return lines.join("\n");
}