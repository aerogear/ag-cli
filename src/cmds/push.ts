import { AbstractNamespaceScopedCommand, expose } from './command-interface';
import { Arguments } from 'yargs';
import { KubeClient } from '../utils/KubeClient';
import { WorkspaceManager } from '../utils/WorkspaceManager';
import { WORKSPACE } from '../global';

/**
 * This class implements the 'push' command, whose role is to push local changes to the server.
 */
class PushCommand extends AbstractNamespaceScopedCommand {
  private readonly workspaceMgr: WorkspaceManager = new WorkspaceManager(
    WORKSPACE,
  );

  constructor() {
    super('push', 'Pushes all local resources in .ag folder into a namespace');
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    // TODO: pass the application name to loadApplication to be able to support more than one app
    const mobileApp = this.workspaceMgr.loadApplication();
    try {
      const cl: KubeClient = await KubeClient.getInstance();
      await cl.push(mobileApp, yargs.namespace as string);
      console.log(`Mobile app "${mobileApp.getName()}" created`);
    } catch (e) {
      console.error(
        `Failed creating app "${mobileApp.getName()}": ${e.message}`,
      );
    }
  };
}

expose(new PushCommand(), module);
