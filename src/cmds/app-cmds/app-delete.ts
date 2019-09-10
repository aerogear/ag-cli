import { Arguments } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';

class AppDeleteCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('delete', 'Deletes a mobile client');
  }
  public handler(yargs: Arguments) {
    //TODO: add here the real code
    console.log('app delete called - namespace:', yargs.namespace);
  }
}

expose(new AppDeleteCommand(), module);
