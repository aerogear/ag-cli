import { Arguments, Argv } from 'yargs';
import * as inquirer from 'inquirer';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import {
  AppDeleteCommand as AgAppDeleteCommand,
  KubeClient,
} from '../../utils/KubeClient';
import { Spinner } from '../../utils/spinner';
import { Answers } from 'inquirer';

/**
 * This class implements the 'app delete' command, whose role is to delete the specified application from the given namespace.
 * The delete is applied directly to the cluster.
 */
class AppDeleteCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('delete <name>', 'Deletes a mobile client');
  }

  protected initCli(yargs: Argv): Argv<any> {
    return yargs
      .positional('name', {
        describe: 'the name of the app to be deleted',
        type: 'string',
      })
      .option('force', {
        alias: 'f',
        type: 'boolean',
        describe:
          'if specified, no confirmation will be required before deleting',
        nargs: 0,
      })
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

  @Spinner({
    pre: 'CLUSTER: Deleting application',
    post: 'CLUSTER: Application deleted successfully',
    fail: 'CLUSTER: Unable to delete the application: %s',
    swallow: true,
  })
  private async remoteDelete(
    namespace: string,
    appname: string,
  ): Promise<void> {
    const cl: KubeClient = await KubeClient.getInstance();
    await cl.execute(new AgAppDeleteCommand(appname, namespace));
  }

  @Spinner({
    pre: 'WORKSPACE: Deleting application',
    post: 'WORKSPACE: Application deleted successfully',
    fail: 'WORKSPACE: Unable to delete the application: %s',
    swallow: true,
  })
  private async localDelete(namespace: string, appname: string): Promise<void> {
    await this.workspace.delete(namespace, appname);
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    const cl: KubeClient = await KubeClient.getInstance();
    const appName = yargs.name as string;
    const namespace = (yargs.namespace as string) || cl.getCurrentNamespace();

    if (!yargs.force) {
      const answers: Answers = await inquirer.prompt([
        {
          name: 'deleteApp',
          type: 'confirm',
          message: `${yargs.name} will no longer be available. It cannot be undone. Are you sure you want to continue ?`,
          default: false,
        },
      ]);
      if (!answers.deleteApp) {
        return;
      }
    }
    console.log('going to delete');
    if (yargs.remote || (!yargs.remote && !yargs.local)) {
      await this.remoteDelete(namespace, appName);
    }

    if (yargs.local || (!yargs.remote && !yargs.local)) {
      await this.localDelete(namespace, appName);
    }
  };
}

expose(new AppDeleteCommand(), module);
