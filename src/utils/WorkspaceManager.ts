import * as fsExtra from 'fs-extra';
import { SerializableInterface } from '../model/SerializableInterface';

/**
 * This class is responsible of managin the workspace folder.
 */
export class WorkspaceManager {
  private readonly path: string;
  constructor(workspacepath: string) {
    this.path = workspacepath;
  }

  /**
   * Checks if the workspace folder already exists.
   */
  public exists(): boolean {
    return fsExtra.existsSync(this.path);
  }

  private wipeOutWorkspace(): void {
    try {
      fsExtra.removeSync(this.path);
    } catch (e) {
      console.error(`Unable to delete the workspace folder (${this.path})`, e);
      process.exit(1);
    }
  }

  private createWorkspaceFolder(): void {
    try {
      fsExtra.mkdir(this.path);
    } catch (e) {
      throw {
        message: `Unable to create the workspace folder (${this.path})`,
        root: e,
      };
    }
  }

  /**
   * Initialises the workspace.
   * @param overwrite if true, silently overwrite an existing workspace. If false, don't do anything if already exists.
   */
  public init(overwrite: boolean = false) {
    if (overwrite && this.exists()) {
      this.wipeOutWorkspace();
    }
    if (!this.exists()) {
      this.createWorkspaceFolder();
    }
  }

  /**
   * Saves an object into the workspace.
   * @param object
   * @param outputfile
   */
  public save(object: SerializableInterface, outputfile: string): void {
    try {
      fsExtra.outputJsonSync(
        `${this.path}/${outputfile || object.getName()}`,
        object.toJson(),
      );
    } catch (e) {
      throw {
        message:
          'Unable to save application into `${WORKSPACE}/mobileapp.json`',
        root: e,
      };
    }
  }
}
