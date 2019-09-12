import { Arguments, Argv } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import { WORKSPACE } from '../../global';
import * as fsExtra from 'fs-extra';
import * as inquirer from 'inquirer';
import { Answers } from 'inquirer';
import { MobileApp } from '../../model/MobileApp';

/**
 * This class implements the 'app init <appname>' command.
 * Its role is to create a new workspace initialised with the specified application name, so that it can be later pushed to the cluster.
 */
class AppInitCommand extends AbstractNamespaceScopedCommand {
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

  private wipeOutWorkspace(): void {
    try {
      fsExtra.removeSync(WORKSPACE);
    } catch (e) {
      console.error(`Unable to delete the workspace folder (${WORKSPACE})`, e);
      process.exit(1);
    }
  }

  private createWorkspaceFolder(): void {
    try {
      fsExtra.mkdir(WORKSPACE);
    } catch (e) {
      throw {
        message: `Unable to create the workspace folder (${WORKSPACE})`,
        root: e,
      };
    }
  }

  private initWorkspace(appName: string): void {
    try {
      this.createWorkspaceFolder();
      MobileApp.SAVE(new MobileApp(appName));
    } catch (e) {
      console.error(e.message);
      process.exit(1);
    }
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    if (fsExtra.existsSync(WORKSPACE)) {
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
      this.wipeOutWorkspace();
    }
    this.initWorkspace(yargs.name as string);
    console.log(`New application "${yargs.name}" initialised`);
  };
}

expose(new AppInitCommand(), module);
