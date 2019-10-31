import { Arguments } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';

/**
 * This class implements the 'app delete' command, whose role is to delete the specified application from the given namespace.
 * The delete is applied directly to the cluster.
 */
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
