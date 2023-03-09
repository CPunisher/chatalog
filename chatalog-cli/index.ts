import { Command } from "commander";
import datalog from "./datalog";

const program = new Command("chatalog");
program.addCommand(datalog);
program.parse();
