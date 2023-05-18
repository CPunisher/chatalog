module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("Each of the following lines is an input: ")
  for (const example of examples.slice(0, 10)) {
    lines.push(`${example[0]}`);
  }
  lines.push("")
  lines.push("Each of the following lines is an corresponding output: ")
  for (const example of examples.slice(0, 10)) {
    lines.push(`${example[1]}`);
  }
  lines.push("")
  lines.push("You can think step by step or use pseudo code as intermediate output.")
  lines.push("Finally please generate a single python function that satisfies the above inputs and outputs.")
  lines.push("You can do extra tests to validate your program but don't include test code.");
  return lines.join("\n");
}