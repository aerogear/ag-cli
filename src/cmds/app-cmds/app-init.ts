import { Arguments, Argv } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import { WORKSPACE } from '../../global';
import * as inquirer from 'inquirer';
import { Answers } from 'inquirer';
import { MobileApp } from '../../model/MobileApp';
import { KubeClient } from '../../utils/KubeClient';
import { Log } from '../../utils/Log';

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
          'if specified, no confirmation will be asked before overwriting existing fails',
        nargs: 0,
      });
  }

  @Log({
    pre: 'Creating new application',
    post: 'Application created successfully',
    fail: 'Failed creating the application: %s',
  })
  private createApp(name: string): void {
    this.workspace.init(true);
    this.workspace.save(
      new MobileApp(name, KubeClient.getInstance().getCurrentNamespace()),
      'mobileapp.json',
    );
  }

  public async handler(yargs: Arguments): Promise<void> {
    if (this.workspace.exists()) {
      if (!yargs.force) {
        const answers: Answers = await inquirer.prompt([
          {
            name: 'wipeWorkspace',
            type: 'confirm',
            message: `Workspace folder (${WORKSPACE}) already exists. Continuing will wipe that out. Continue ?`,
            default: false,
          },
        ]);

        if (!answers.wipeWorkspace) {
          process.exit(1);
        }
      }
    }

    this.createApp(yargs.name as string);
  }
}

expose(new AppInitCommand(), module);
