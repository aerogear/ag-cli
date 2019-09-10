import { Arguments, Argv } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';

class AppInitCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('init <name>', 'Initialize a new app');
  }

  protected initCli(yargs: Argv): Argv {
    return yargs.positional('name', {
      describe: 'the name of the app to be created',
      type: 'string',
    });
  }

  public handler(yargs: Arguments) {
    //TODO: add here the real code
    console.log('app init called');
  }
}

expose(new AppInitCommand(), module);
