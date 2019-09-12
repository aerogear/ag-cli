import { Arguments, Argv } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import { WORKSPACE } from '../../global';
import * as inquirer from 'inquirer';
import { Answers } from 'inquirer';
import { MobileApp } from '../../model/MobileApp';
import { WorkspaceManager } from '../../utils/WorkspaceManager';

/**
 * This class implements the 'app init <appname>' command.
 * Its role is to create a new workspace initialised with the specified application name, so that it can be later pushed to the cluster.
 */
class AppInitCommand extends AbstractNamespaceScopedCommand {
  private readonly workspaceMgr: WorkspaceManager = new WorkspaceManager(
    WORKSPACE,
  );

  constructor() {
    super('init <name>', 'Initialize a new app');
  }

  protected initCli(yargs: Argv): Argv {
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

  public handler = async (yargs: Arguments): Promise<void> => {
    if (this.workspaceMgr.exists()) {
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

    try {
      this.workspaceMgr.init(true);
      this.workspaceMgr.save(
        new MobileApp(yargs.name as string),
        'mobileapp.json',
      );
      console.log(`New application "${yargs.name}" initialised`);
    } catch (e) {
      console.error('Failed initializing the workspace: ', e.message);
    }
  };
}

expose(new AppInitCommand(), module);
