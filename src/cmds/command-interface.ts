import { Argv } from 'yargs';

export interface CliCommand {
  name: string;
  desc: string;
  handler?(yargs: Argv): void;
  builder?(yargs: Argv): void;
}

// tslint:disable-next-line: no-any
export function publish(cliCommand: CliCommand, commandModule: any) {
  commandModule.exports.command = cliCommand.name;
  commandModule.exports.desc = cliCommand.desc;

  commandModule.exports.builder = cliCommand.builder || {};
  commandModule.exports.handler = cliCommand.handler || (() => undefined);
}
