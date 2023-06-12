import fs from "node:fs";
import path from "node:path";
const [_1, _2, templateDir, convDir, outDir] = process.argv;

const files = fs.readdirSync(templateDir);
for (const file of files) {
  const templateFilePath = path.join(templateDir, file);
  const convFilePath = path.join(convDir, file);
  const templateContent = fs.readFileSync(templateFilePath);
  const convContent = fs.readFileSync(convFilePath).toString();
  const template = JSON.parse(templateContent);

  template.messages.push({
    role: "system",
    content: convContent,
  });
  const outFile = path.join(outDir, file);
  fs.writeFileSync(outFile, JSON.stringify(template, null, 2));
}
