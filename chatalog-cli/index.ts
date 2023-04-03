import { Command } from "commander";
import CommandGenerteTemplate from "./generate-template";
import CommandReport from "./report";
import CommandSendMessage from "./send-message";
import CommandFixMessage from "./fix-message";

const program = new Command("chatalog");
program.addCommand(CommandGenerteTemplate);
program.addCommand(CommandSendMessage);
program.addCommand(CommandFixMessage);
program.addCommand(CommandReport);
program.parse();
