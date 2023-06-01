function slash(str) {
  return str.replace(/\"/gm, '\\"');
}

module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("Complete the following python function based on specification in comments.");
  lines.push("Don't generate any explanation and comment. Just complete the python function.");
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