import { Arguments } from 'yargs';
import { AbstractCommand, expose } from '../command-interface';

class ServiceListCommand extends AbstractCommand {
  constructor() {
    super('list', 'List all available mobile services');
  }
  public handler(yargs: Arguments) {
    //TODO: add here the real code
    console.log('service list called - namespace:', yargs.namespace);
  }
}

expose(new ServiceListCommand(), module);
