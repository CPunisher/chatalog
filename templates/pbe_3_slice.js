module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("The first column is input, and the second is output. Please generate a program by these examples.")
  for (const example of examples.slice(0, 50)) {
    lines.push(`${example[0]},${example[1]}`);
  }
  return lines.join("\n");
}