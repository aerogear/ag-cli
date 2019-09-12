import { AbstractNamespaceScopedCommand, expose } from './command-interface';
import { Arguments } from 'yargs';
import { KubeClient } from '../utils/KubeClient';

/**
 * This class implements the 'push' command, whose role is to push local changes to the server.
 */
class PushCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('push', 'Pushes all local resources in .ag folder into a namespace');
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    try {
      // TODO: pass the application name to loadApplication to be able to support more than one app
      const mobileApp = this.workspace.loadApplication();
      this.spinner.start('Pushing application to the cluster');
      const cl: KubeClient = await KubeClient.getInstance();
      await cl.push(mobileApp, yargs.namespace as string);
      this.spinner.succeed(
        `Mobile app "${mobileApp.getName()}" successfully pushed`,
      );
    } catch (e) {
      this.spinner.fail(
        `Error pushing the application to the cluster: ${e.message}`,
      );
    }
  };
}

expose(new PushCommand(), module);
