import { Argv } from 'yargs';

import { CommandInterface, expose } from './command-interface';

class AppCommand implements CommandInterface {
  public name: string = 'app';
  public desc: string = 'Manages applications';
  public builder(yargs: Argv) {
    // tslint:disable-next-line: no-unused-expression
    return yargs
      .commandDir('app-cmds', {
        exclude: /.*test\.js$/
      })
      .demandCommand()
      .help();
  }
}

expose(new AppCommand(), module);
