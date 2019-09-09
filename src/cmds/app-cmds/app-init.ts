import { Argv } from 'yargs';
import { CliCommand, publish } from '../command-interface';

class AppInitCommand implements CliCommand {
  public name: string = 'init';
  public desc: string = 'Initialize a new app';
  public handler(yargs: Argv) {
    console.log('app init called');
  }
}

publish(new AppInitCommand(), module);
