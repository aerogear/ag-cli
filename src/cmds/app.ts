import { Argv } from 'yargs';

import { CliCommand, publish } from './command-interface';

class AppCommand implements CliCommand {
  public name: string = 'app';
  public desc: string = 'Create an empty repo';
  public builder(yargs: Argv) {
    // tslint:disable-next-line: no-unused-expression
    yargs.commandDir('app-cmds').demandCommand().argv;
  }
}

publish(new AppCommand(), module);
