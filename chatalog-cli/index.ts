import { Command } from "commander";
import CommandGenerteTemplate from "./generate-template";

const program = new Command("chatalog");
program.addCommand(CommandGenerteTemplate);
program.parse();
