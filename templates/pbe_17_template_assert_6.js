function slash(str) {
  return str.replace(/\"/gm, '\\"');
}

module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("Complete the following python function to pass all assertions");
  lines.push("```python");
  lines.push("def func(input_string):")
  lines.push("  \"\"\"")
  lines.push("  Decompose the predure into muiltiple steps and write to this comment block.")
  lines.push("  Try to be consistent in the syntax of each step description, starting with a verb and no more than one sentence")
  lines.push("  \"\"\"")
  lines.push("  ")
  lines.push("  # Implement your program here.")
  lines.push("  ")
  lines.push("  ")
  lines.push("  # Test cases")
  for (const example of examples.slice(0, 10)) {
    lines.push(`  assert func("${slash(example[0])}") == ${slash(example[1])}`);
  }
  lines.push("```");
  return lines.join("\n");
}