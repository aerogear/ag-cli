import * as fsExtra from 'fs-extra';
import { MobileApp } from '../../model/MobileApp';
import { Spinner } from '../../utils/spinner';
import { WorkspaceInterface } from '../WorkspaceInterface';

/**
 * Filesystem implementation of the WorkspaceInterface.
 * Creates a workspace folder ('.ag') into the user home.
 */
export class FSWorkspace implements WorkspaceInterface {
  private readonly path: string;

  constructor() {
    this.path = require('os').homedir() + '/.ag/workspace';
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
  private init(overwrite: boolean = false) {
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
      const appJson = app.toJson();
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

  public async delete(namespace: string, appName: string) {
    const fileName = appName + '.json';
    await fsExtra.unlink(`${this.path}/${namespace}/${fileName}`);
  }

  public async list(namespace: string): Promise<string[]> {
    if (await this.exists(namespace)) {
      const files = await fsExtra.readdir(`${this.path}/${namespace}`);
      return files.reduce((accumulator: string[], curval: string) => {
        if (curval.endsWith('.json')) {
          accumulator.push(curval.substr(0, curval.indexOf('.json')));
        }
        return accumulator;
      }, []);
    }
    return [];
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
    return new MobileApp(appJson).namespace(namespace);
  }
}
