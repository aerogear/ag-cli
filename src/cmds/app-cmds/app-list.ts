import { Arguments, Argv } from 'yargs';
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

  protected initCli(yargs: Argv): Argv<any> {
    return yargs
      .option('local', {
        alias: 'l',
        type: 'boolean',
        describe:
          "if specified, the application will be deleted only from the workspace (cluster won't be affected)",
        nargs: 0,
      })
      .option('remote', {
        alias: 'r',
        type: 'boolean',
        describe:
          "if specified, the application will be deleted only from the cluster (the workspace won't be affected)",
        nargs: 0,
      });
  }

  private showRemoteLocal(yargs: Arguments): boolean {
    return !(yargs.local || yargs.remote) || !!(yargs.local && yargs.remote);
  }

  public safeHandler = async (yargs: Arguments): Promise<void> => {
    const namespace =
      (yargs.namespace as string) ||
      KubeClient.getInstance().getCurrentNamespace();

    try {
      const cl: KubeClient = await KubeClient.getInstance();

      const appList = {};

      if (yargs.remote || !(yargs.local || yargs.remote)) {
        const remoteAppList = await cl.execute(new AgAppListCommand(namespace));
        remoteAppList.reduce((accumulator: any, curval: any) => {
          accumulator[curval.metadata.name] = { remote: true };
          return accumulator;
        }, appList);
      }

      if (yargs.local || !(yargs.local || yargs.remote)) {
        const localAppList = await this.workspace.list(namespace);
        localAppList.reduce((accumulator: any, curval: string) => {
          if (appList[curval]) {
            appList[curval].local = true;
          } else {
            appList[curval] = { local: true };
          }
        }, appList);
      }

      const showRemoteLocalCol = this.showRemoteLocal(yargs);

      const table = new Table(
        showRemoteLocalCol
          ? {
              head: ['APP NAME', 'NAMESPACE', 'REMOTE/LOCAL'],
            }
          : {
              head: ['APP NAME', 'NAMESPACE'],
            },
      );

      Object.keys(appList)
        .sort()
        .forEach((app: string) =>
          showRemoteLocalCol
            ? table.push([
                app,
                namespace,
                `${appList[app].remote ? 'R' : ''}${
                  appList[app].local ? 'L' : ''
                }`,
              ])
            : table.push([app, namespace]),
        );
      console.log(table.toString());
    } catch (error) {
      console.error(`An error has occurred: ${error.message}`);
    }
  };
}

expose(new AppListCommand(), module);
