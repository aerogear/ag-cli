import { AbstractNamespaceScopedCommand, expose } from './command-interface';

class PushCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('push', 'Pushes all local resources in .ag folder into a namespace');
  }
}

expose(new PushCommand(), module);
