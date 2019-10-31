import { Arguments } from 'yargs';
import * as Table from 'cli-table';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import {
  AppListCommand as AgAppListCommand,
  KubeClient,
} from '../../utils/KubeClient';

/**
 * This class implements the 'app list' command, whose role is to list all the applications in a specified namespace.
 */
class AppListCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super(
      'list',
      'Lists all mobile client in a namespace (defaults to the current project)',
    );
  }

  public safeHandler = async (yargs: Arguments): Promise<void> => {
    try {
      const cl: KubeClient = await KubeClient.getInstance();
      const appList = await cl.execute(
        new AgAppListCommand(yargs.namespace as string),
      );

      const table = new Table({
        head: ['REMOTE/LOCAL', 'NAMESPACE', 'APP NAME'],
      });

      appList.forEach((app: any) =>
        table.push(['R', app.metadata.namespace, app.metadata.name]),
      );
      console.log(table.toString());
    } catch (error) {
      console.error(`An error has occurred: ${error.message}`);
    }
  };
}

expose(new AppListCommand(), module);
