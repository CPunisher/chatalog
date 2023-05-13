import { Command } from "commander";
import { CommandTemplate } from "./template";
import CommandReport from "./report";
import CommandSendMessage from "./send-message";
import CommandSendPBEMessage from "./send-pbe-message";
import CommandTestSouffle from "./test-souffle";
import CommandTestPBE from "./test-pbe";

const program = new Command();
program.addCommand(CommandTemplate);
program.addCommand(CommandSendMessage);
program.addCommand(CommandSendPBEMessage);
program.addCommand(CommandTestSouffle);
program.addCommand(CommandTestPBE);
program.addCommand(CommandReport);
program.parse();
