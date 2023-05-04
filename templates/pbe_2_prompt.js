module.exports = function ({ examples }) {
  const lines = [];
  for (const example of examples) {
    lines.push(`${example[0]},${example[1]}`);
  }
  lines.push("\nThe first column is input, and the second is output. Please generate a program by these examples.")
  return lines.join("\n");
}