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
  
    # Step 1: Split the input string by the '/' character to get the individual components.
    components = input_string.split('/')
    
    # Step 2: Extract the last component from the components list.
    last_component = components[-1]
    
    # Step 3: Replace the underscores in the last component with spaces.
    result = last_component.replace('_', ' ')
    
    # Step 4: Return the result.
    return result
  \`\`\`
  `);
  lines.push(`
  \`\`\`
  def func(input_string):
    """
    Examples:
    func("1860") = 1860
    func("1844") = 1844
    func("1858 - 1937") = 1858
    func("1824 - 1906") = 1824
    func("1844 - 1916") = 1844
    func("1871 - 1951") = 1871
    func("1784 - 1861") = 1784
    func("1844 - 1916") = 1844
    func("1844 - 1916") = 1844
    func("1779 - 1843. After Titian (Tiziano Vecellio)") = 1779
    """

    # Step 1: Check if the input_string contains a hyphen.
    if '-' in input_string:
        # Step 2: Split the input_string into two parts using the hyphen as a delimiter.
        parts = input_string.split('-')
        # Step 3: Remove leading and trailing whitespace from each part.
        parts = [part.strip() for part in parts]
        # Step 4: Extract the first part as the result.
        result = int(parts[0])
    else:
        # Step 5: If there is no hyphen, convert the input_string directly to an integer as the result.
        result = int(input_string)

    # Step 6: Return the final result.
    return result
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