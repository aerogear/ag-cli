import * as fsExtra from 'fs-extra';
import { MobileApp } from '../model/MobileApp';
import { Spinner } from './spinner';

/**
 * This class is responsible of managin the workspace folder.
 */
export class WorkspaceManager {
  private readonly path: string;
  constructor(workspacepath: string) {
    this.path = workspacepath;
    if (!this.exists()) {
      this.init(false);
    }
  }

  /**
   * Checks if the workspace folder or the provided app exists.
   */
  public exists(namespace?: string, appName?: string): boolean {
    if (!appName && !namespace) {
      return fsExtra.existsSync(this.path);
    }

    if (!appName && namespace) {
      return fsExtra.existsSync(`${this.path}/${namespace}`);
    }

    return fsExtra.existsSync(`${this.path}/${namespace}/${appName}.json`);
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
        message: `Unable to wipe out the workspace folder (${this.path})`,
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
   * @param app
   */
  public async save(app: MobileApp): Promise<void> {
    const fileName = app.getName() + '.json';
    try {
      await fsExtra.mkdirp(`${this.path}/${app.getNameSpace()}`);
      await fsExtra.outputJson(
        `${this.path}/${app.getNameSpace()}/${fileName}`,
        app.toJson(),
      );
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
  public async loadApplication(
    namespace: string,
    appName: string,
  ): Promise<MobileApp> {
    const appJson = await fsExtra.readJSON(
      `${this.path}/${namespace}/${appName}.json`,
    );
    return new MobileApp(appJson.metadata.name, appJson.status.namespace);
  }
}
