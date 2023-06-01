function slash(str) {
  return str.replace(/\"/gm, '\\"');
}

function fewShot(lines) {
  lines.push("Here are some samples:")
  lines.push(`
  \`\`\`
  def func(input_string):
    """
    Examples:
    func("http://dbpedia.org/resource/Air_Europa") = Air Europa
    func("http://dbpedia.org/resource/Aegean_Airlines") = Aegean Airlines
    func("http://dbpedia.org/resource/Air_Berlin") = Air Berlin
    func("http://dbpedia.org/resource/Air_France") = Air France
    func("http://dbpedia.org/resource/Air_Canada") = Air Canada
    func("http://dbpedia.org/resource/US_Airways") = US Airways
    func("http://dbpedia.org/resource/Air_Malta") = Air Malta
    func("http://dbpedia.org/resource/Germanwings") = Germanwings
    func("http://dbpedia.org/resource/Aer_Lingus") = Aer Lingus
    func("http://dbpedia.org/resource/Virgin_Express") = Virgin Express
    """
  
    """
    Step 1: Split the input string by the '/' character to get the individual components.
    Step 2: Extract the last component from the components list.
    Step 3: Replace the underscores in the last component with spaces.
    Step 4: Return the result.
    """
    
    components = input_string.split('/')
    last_component = components[-1]
    result = last_component.replace('_', ' ')
    return result
  \`\`\`
  `);
  lines.push(`
  \`\`\`
  def func(input_string):
    """
    Examples:
    func("Number of Completed Surveys") = 0
    func("300 or more") = 3
    func("300 or more") = 3
    func("300 or more") = 3
    func("Between 100 and 299") = 2
    func("Between 100 and 299") = 2
    func("300 or more") = 3
    func("300 or more") = 3
    func("300 or more") = 3
    func("Fewer than 100") = 1
    """

    """
    Step 1: Remove leading and trailing whitespace from the input string.
    Step 2: Convert the input string to lowercase.
    Step 3: Check if the input string contains the word "fewer" and the number 100.
    Step 4: Check if the input string contains the words "between", "and", and the numbers 100 and 299.
    Step 5: Check if the input string contains the words "300" or "more".
    Step 6: If none of the above conditions are met, return 0.
    """

    input_string = input_string.strip()
    input_string = input_string.lower()
    if "fewer" in input_string and "100" in input_string:
        return 1

    if "between" in input_string and "and" in input_string and "100" in input_string and "299" in input_string:
        return 2

    if "300" in input_string or "more" in input_string:
        return 3
    return 0
  \`\`\`
  `);
}

module.exports = function ({ data }) {
  const { examples } = data;
  const lines = [];
  lines.push("Complete the following python function based on specification in comments.");
  lines.push("Decompose the predure into muiltiple steps and write to a comment block.")
  lines.push("Try to be consistent in the syntax of each step description, starting with a verb and no more than one sentence")
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
  fewShot(lines);
  return lines.join("\n");
}