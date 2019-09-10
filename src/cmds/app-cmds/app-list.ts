import { Arguments } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';

class AppListCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super(
      'list',
      "Lists all mobile client in a namespace (default 'mobile-developer-console')",
    );
  }
  public handler(yargs: Arguments) {
    //TODO: add here the real code
    console.log('app list called - namespace:', yargs.namespace);
  }
}

expose(new AppListCommand(), module);
