import { Arguments } from 'yargs';
import { AbstractCommand, expose } from '../command-interface';

/**
 * Class implementing the 'service delete' command, whose role is to remove the specified 'service binding' from the app.
 */
class ServiceDeleteCommand extends AbstractCommand {
  constructor() {
    super(
      'delete',
      'Deletes a service binding from a mobile client using the local mobile client resource as reference.',
    );
  }
  public handler(yargs: Arguments) {
    //TODO: add here the real code
    console.log('service delete called - namespace:', yargs.namespace);
  }
}

expose(new ServiceDeleteCommand(), module);
