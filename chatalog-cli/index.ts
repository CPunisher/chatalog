import { Command } from "commander";
import CommandGenerteTemplate from "./generate-template";
import CommandReport from "./report";
import CommandSendMessage from "./send-message";
import CommandFixMessage from "./fix-message";
import CommandTest from "./test";

const program = new Command("chatalog");
program.addCommand(CommandGenerteTemplate);
program.addCommand(CommandSendMessage);
program.addCommand(CommandFixMessage);
program.addCommand(CommandTest);
program.addCommand(CommandReport);
program.parse();
