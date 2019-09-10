import { Arguments } from 'yargs';
import { AbstractCommand, expose } from '../command-interface';

class AppGenCommand extends AbstractCommand {
  constructor() {
    super('gen', 'Generates/updates the mobile-services.json file');
  }
  public handler(yargs: Arguments) {
    //TODO: add here the real code
    console.log('app gen called');
  }
}

expose(new AppGenCommand(), module);
