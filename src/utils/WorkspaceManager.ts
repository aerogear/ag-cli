import * as fsExtra from 'fs-extra';
import { SerializableInterface } from '../model/SerializableInterface';
import { MobileApp } from '../model/MobileApp';
import { Spinner } from './spinner';

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

  @Spinner({
    pre: 'Wiping out current workspace',
    post: 'Workspace wiped out',
    fail: 'Failed wiping the workspace: %s',
  })
  private wipeOutWorkspace(): void {
    try {
      fsExtra.removeSync(this.path);
    } catch (e) {
      throw {
        message: `Unable to create the workspace folder (${this.path})`,
        root: e,
      };
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
  @Spinner({
    pre: 'Initializing the workspace',
    post: 'New workspace initialised',
    fail: 'Failed initialising the workspace: %s',
  })
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
    const fileName = outputfile || object.getName() + '.json';
    try {
      fsExtra.outputJsonSync(`${this.path}/${fileName}`, object.toJson());
    } catch (e) {
      throw {
        message: `Unable to save application into ${this.path}/${fileName}`,
        root: e,
      };
    }
  }

  @Spinner({
    pre: 'Loading application from the workspace',
    post: 'Application loaded',
    fail: 'Failed loading application from the workspace: %s',
  })
  public loadApplication(appName?: string): MobileApp {
    const appJson = fsExtra.readJSONSync(
      `${this.path}/${appName ? appName + '.json' : 'mobileapp.json'}`,
    );
    return new MobileApp(appJson.metadata.name, appJson.status.namespace);
  }
}
