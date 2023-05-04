import { Command } from "commander";
import CommandGenerteTemplate from "./generate-template";
import CommandGeneratePBETemplate from "./generate-pbe-template";
import CommandReport from "./report";
import CommandSendMessage from "./send-message";
import CommandSendPBEMessage from "./send-pbe-message";
import CommandFixMessage from "./fix-message";
import CommandTest from "./test";

const program = new Command("chatalog");
program.addCommand(CommandGenerteTemplate);
program.addCommand(CommandGeneratePBETemplate);
program.addCommand(CommandSendMessage);
program.addCommand(CommandSendPBEMessage);
program.addCommand(CommandFixMessage);
program.addCommand(CommandTest);
program.addCommand(CommandReport);
program.parse();
