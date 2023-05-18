module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("Each of the following lines is an example input: ")
  for (const example of examples.slice(0, 10)) {
    lines.push(`${example[0]}`);
  }
  lines.push("")
  lines.push("Each of the following lines is an corresponding example output: ")
  for (const example of examples.slice(0, 10)) {
    lines.push(`${example[1]}`);
  }
  lines.push("Generate a single python function with all helper functions in it, which satisfies the examples.")
  lines.push("Don't inline test cases in the same code block.")
  lines.push("Decompose the procedure into multiple steps before you generate code")
  lines.push("Try to be consistent in the syntax of each step description, starting with a verb and no more than one sentence")
  return lines.join("\n");
}

/**
1. Only essential steps are necessary for prompt. Detailed explanations in the prompt can obstruct
the model’s ability to decompose the task and should be avoided. The model can independently
perform the necessary details to fulfill the intent.
2. Clearly specify a set of rules. Ensure that all examples in the prompt exhibit a consistent pattern,
such as beginning with a verb or using consistent language constructs, such as "if," "check,"
"return," "create," etc.
3. Select examples that represent the majority of cases. It is important not to include examples that
are atypical or marginal as this may negatively impact the performance of the model. The selected
examples should be of average length and representative of typical tasks and solutions.
4. Incorporate code features. The desired functionality, such as the definition of helper functions
and the importation of libraries, can be introduced into the prompt through the use of directive
statements.
 */