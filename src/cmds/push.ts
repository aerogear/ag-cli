import { AbstractNamespaceScopedCommand, expose } from './command-interface';
import { Arguments, Argv } from 'yargs';
import { KubeClient, AppPushCommand } from '../utils/KubeClient';
import { MobileApp } from '../model/MobileApp';
import { Spinner } from '../utils/spinner';

/**
 * This class implements the 'push' command, whose role is to push local changes to the server.
 */
class PushCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super(
      'push <appname>',
      'Pushes all local resources in .ag folder into a namespace',
    );
  }

  protected initCli(yargs: Argv): Argv<any> {
    return yargs.positional('name', {
      describe: 'the name of the app to be pushed',
      type: 'string',
    });
  }

  @Spinner({
    pre: 'Pushing application to the cluster',
    post: 'Application pushed successfully',
    fail: 'Error pushing the application to the cluster: %s',
    swallow: true,
  })
  private async pushApplication(mobileApp: MobileApp): Promise<void> {
    const cl: KubeClient = await KubeClient.getInstance();
    await cl.execute(new AppPushCommand(mobileApp, mobileApp.getNameSpace()));
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    const cl: KubeClient = await KubeClient.getInstance();
    const mobileApp = await this.workspace.loadApplication(
      (yargs.namespace as string) || cl.getCurrentNamespace(),
      yargs.appname as string,
    );
    await this.pushApplication(mobileApp);
  };
}

expose(new PushCommand(), module);
