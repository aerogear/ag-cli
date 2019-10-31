import { Argv } from 'yargs';

import { CommandInterface, expose } from './command-interface';

/**
 * This class implements the 'app' command.
 * It is just a container for the 'app' subcommands.
 */
class AppCommand implements CommandInterface {
  public name: string = 'app';
  public desc: string = 'Manages applications';
  public builder(yargs: Argv) {
    // tslint:disable-next-line: no-unused-expression
    return yargs
      .commandDir('app-cmds', {
        exclude: /.*test\.js$/,
      })
      .demandCommand()
      .help();
  }
}

expose(new AppCommand(), module);
