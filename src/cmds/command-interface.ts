import { Argv, Arguments } from 'yargs';
import { WorkspaceManager } from '../utils/WorkspaceManager';
import { WORKSPACE } from '../global';
import Module = NodeJS.Module;

/**
 * Interface to be implemented by all the commands.
 */
export interface CommandInterface {
  /**
   * The name of the command. This will appear in the command line.
   */
  readonly name: string;
  /**
   * A description of what the command does. This will be used to generate an help screen.
   */
  readonly desc: string;

  /**
   * This function will be called when the command is invoked from the command line.
   * If omitted, then the command must be a container for other subcommands.
   * @param yargs
   */
  handler?(yargs: Arguments): void;

  /**
   * Configure the yargs command line parser.
   * @param yargs
   */
  builder?(yargs: Argv): Argv;
}

/**
 * Base class for commands.
 */
export abstract class AbstractCommand implements CommandInterface {
  readonly name: string;
  readonly desc: string;
  protected readonly workspace: WorkspaceManager;

  protected constructor(name: string, desc: string) {
    this.name = name;
    this.desc = desc;
    this.workspace = new WorkspaceManager(WORKSPACE);
  }

  protected async safeHandler(yargs: Arguments): Promise<void> {}

  public handler = async (yargs: Arguments): Promise<void> => {
    try {
      return await this.safeHandler(yargs);
    } catch (error) {
      console.error(`An error has occurred: ${error.message}`);
    }
    return;
  };
}

/**
 * Most of the commands will be namespace scoped. Extending this class, the command will get the '-n|--namespace' option.
 */
export abstract class AbstractNamespaceScopedCommand extends AbstractCommand {
  /**
   * Implement this method to configure the yarg parser. No need to add the '-n|--namespace'.
   * @param yargs
   */
  protected initCli?(yargs: Argv): Argv;

  private initYargs(yargs: Argv): Argv<any> {
    return yargs
      .option('namespace', {
        alias: 'n',
        type: 'string',
        describe: 'namespace',
        nargs: 1,
      })
      .help();
  }

  public readonly builder = (yargs: Argv) => {
    if (this.initCli) {
      return this.initCli(this.initYargs(yargs));
    } else {
      return this.initYargs(yargs);
    }
  };
}

/**
 * This method must be called to expose the command to yargs.
 * @param cliCommand - the command to be exposed
 * @param commandModule - the module containing the command
 */
export function expose(cliCommand: CommandInterface, commandModule: Module) {
  commandModule.exports.command = cliCommand.name;
  commandModule.exports.desc = cliCommand.desc;

  commandModule.exports.builder = cliCommand.builder || {};
  commandModule.exports.handler = cliCommand.handler || (() => undefined);
}
