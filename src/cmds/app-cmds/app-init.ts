import { Arguments, Argv } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import * as inquirer from 'inquirer';
import { Answers } from 'inquirer';
import { MobileApp } from '../../model/MobileApp';
import { KubeClient } from '../../utils/KubeClient';
import { Spinner } from '../../utils/spinner';

/**
 * This class implements the 'app init <appname>' command.
 * Its role is to create a new workspace initialised with the specified application name, so that it can be later pushed to the cluster.
 */
class AppInitCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('init <name>', 'Initialise a new app');
    this.handler = this.handler.bind(this);
  }

  protected initCli(yargs: Argv): Argv<any> {
    return yargs
      .positional('name', {
        describe: 'the name of the app to be created',
        type: 'string',
      })
      .option('force', {
        alias: 'f',
        type: 'boolean',
        describe:
          'if specified, no confirmation will be asked before overwriting existing files',
        nargs: 0,
      });
  }

  @Spinner({
    pre: 'Creating new application',
    post: 'Application created successfully',
    fail: 'Failed creating the application: %s',
  })
  private async createApp(namespace: string, name: string): Promise<void> {
    await this.workspace.save(new MobileApp(name, namespace));
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    const name: string = yargs.name as string;
    const namespace: string =
      (yargs.namespace as string) ||
      KubeClient.getInstance().getCurrentNamespace();

    if (this.workspace.exists(namespace, name)) {
      if (!yargs.force) {
        const answers: Answers = await inquirer.prompt([
          {
            name: 'wipeApp',
            type: 'confirm',
            message: `An application named '${name}' already exists in namespace '${namespace}'. Continuing will overwrite that. Continue ?`,
            default: false,
          },
        ]);

        if (!answers.wipeApp) {
          return;
        }
      }
    }

    await this.createApp(namespace, name);
  };
}

expose(new AppInitCommand(), module);
