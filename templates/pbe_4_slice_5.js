module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("Each of the following lines is an input: ")
  for (const example of examples.slice(0, 5)) {
    lines.push(`${example[0]}`);
  }
  lines.push("")
  lines.push("Each of the following lines is an corresponding output: ")
  for (const example of examples.slice(0, 5)) {
    lines.push(`${example[1]}`);
  }
  lines.push("")
  lines.push("Please generate a python program that satisfies the above inputs and outputs.")
  return lines.join("\n");
}