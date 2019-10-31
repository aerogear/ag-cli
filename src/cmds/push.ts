import { AbstractNamespaceScopedCommand, expose } from './command-interface';
import { Arguments } from 'yargs';
import { KubeClient } from '../utils/KubeClient';
import { MobileApp } from '../model/MobileApp';
import { SpinnerAsync } from '../utils/spinner';

/**
 * This class implements the 'push' command, whose role is to push local changes to the server.
 */
class PushCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('push', 'Pushes all local resources in .ag folder into a namespace');
  }

  @SpinnerAsync({
    pre: 'Pushing application to the cluster',
    post: 'Application pushed successfully',
    fail: 'Error pushing the application to the cluster: %s',
    swallow: true,
  })
  private async pushApplication(
    mobileApp: MobileApp,
    namespace: string,
  ): Promise<void> {
    const cl: KubeClient = await KubeClient.getInstance();
    await cl.push(mobileApp, namespace);
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    // TODO: pass the application name to loadApplication to be able to support more than one app
    const mobileApp = this.workspace.loadApplication();
    await this.pushApplication(mobileApp, yargs.namespace as string);
  };
}

expose(new PushCommand(), module);
