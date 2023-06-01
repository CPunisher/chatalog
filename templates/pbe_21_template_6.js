function slash(str) {
  return str.replace(/\"/gm, '\\"');
}

module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("Complete the following python function based on specification in comments.");
  lines.push("Decompose the predure into muiltiple steps and write to a comment block.")
  lines.push("Try to be consistent in the syntax of each step description, starting with a verb and no more than one sentence")
  lines.push("For the output, replace 'None' with 'none', concatenate each item of the tuple into a single string using commas, and pay attention to the rounding of numbers.")
  lines.push("```python");
  lines.push("def func(input_string):")
  lines.push("  \"\"\"")
  lines.push("  Examples:")
  for (const example of examples.slice(0, 10)) {
    lines.push(`  func("${slash(example[0])}") = ${slash(example[1])}`);
  }
  lines.push("  \"\"\"")
  lines.push("  ")
  lines.push("  # Implement your program here.")
  lines.push("  ")
  lines.push("```");
  return lines.join("\n");
}