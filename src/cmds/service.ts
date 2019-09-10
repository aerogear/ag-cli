import { Argv } from 'yargs';

import { CommandInterface, expose } from './command-interface';

class ServiceCommand implements CommandInterface {
  public name: string = 'service';
  public desc: string = 'Handles mobile services';
  public builder(yargs: Argv) {
    // tslint:disable-next-line: no-unused-expression
    return yargs
      .commandDir('service-cmds', {
        exclude: /.*test\.js$/
      })
      .demandCommand()
      .help();
  }
}

expose(new ServiceCommand(), module);
