import { Arguments } from 'yargs';
import { AbstractCommand, expose } from '../command-interface';

/**
 * This class implements the 'app-gen' command, whose role is to generate locally the 'mobile-services.json' file.
 */
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
