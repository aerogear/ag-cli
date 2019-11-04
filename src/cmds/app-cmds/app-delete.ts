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
      });
  }

  @Spinner({
    pre: 'Deleting application from the cluster',
    post: 'Application deleted successfully',
    fail: 'Error deleting the application from the cluster: %s',
    swallow: true,
  })
  private async delete(namespace: string, appname: string): Promise<void> {
    const cl: KubeClient = await KubeClient.getInstance();
    await cl.execute(new AgAppDeleteCommand(appname, namespace));
  }

  public handler = async (yargs: Arguments): Promise<void> => {
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
    this.delete(yargs.namespace as string, yargs.name as string);
  };
}

expose(new AppDeleteCommand(), module);
