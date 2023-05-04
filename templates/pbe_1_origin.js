module.exports = function ({ examples }) {
  const lines = [];
  for (const example of examples) {
    lines.push(`${example[0]},${example[1]}`);
  }
  return lines.join("\n");
}