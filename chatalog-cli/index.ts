import { Command } from "commander";
import { CommandTemplate } from "./command/template";
import { CommandConversation } from "./command/send-message";
import CommandReport from "./command/report";
import CommandTestSouffle from "./command/test-souffle";
import CommandTestPBE from "./command/test-pbe";

const program = new Command();
program.addCommand(CommandTemplate);
program.addCommand(CommandConversation);
program.addCommand(CommandTestSouffle);
program.addCommand(CommandTestPBE);
program.addCommand(CommandReport);
program.parse();
