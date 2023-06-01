import { Command } from "commander";
import { CommandTemplate } from "./command/template";
import { CommandConversation } from "./command/send-message";
import { CommandValidate } from "./command/validate";
import { CommandReport } from "./command/report";
import { CommandChart } from "./command/chart";

const program = new Command();
program.addCommand(CommandTemplate);
program.addCommand(CommandConversation);
program.addCommand(CommandValidate);
program.addCommand(CommandReport);
program.addCommand(CommandChart);
program.parse();
