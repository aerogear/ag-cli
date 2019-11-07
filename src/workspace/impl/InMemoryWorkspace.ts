import { MobileApp } from '../../model/MobileApp';
import { Spinner } from '../../utils/spinner';
import { WorkspaceInterface } from '../WorkspaceInterface';

/**
 * In memory implementation of the workspace interface.
 */
export class InMemoryWorkspace implements WorkspaceInterface {
  private ws: any = {};

  /**
   * Checks if the workspace folder or the provided app exists.
   */
  public exists(namespace?: string, appName?: string): boolean {
    if (!appName && !namespace) {
      return true;
    }

    if (!appName && namespace) {
      return !!this.ws[namespace];
    }

    return !!(this.ws[namespace] && this.ws[namespace][appName]);
  }

  @Spinner({
    pre: 'Wiping out current workspace',
    post: 'Workspace wiped out',
    fail: 'Failed wiping the workspace: %s',
  })
  private wipeOutWorkspace(): void {
    this.ws = {};
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
  }

  /**
   * Saves an object into the workspace.
   * @param app
   */
  public async save(app: MobileApp): Promise<void> {
    if (!this.ws[app.getNameSpace()]) {
      this.ws[app.getNameSpace()] = {};
    }
    this.ws[app.getNameSpace()][app.getName()] = app;
  }

  public async list(namespace: string): Promise<string[]> {
    if (await this.exists(namespace)) {
      return Object.keys(this.ws[namespace]);
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
    if (this.ws[namespace] && this.ws[namespace][appName]) {
      return this.ws[namespace][appName];
    }
    throw {
      message: `No application named 'appName' exists in namespace '${namespace}'`,
    };
  }

  public async delete(namespace: string, appName: string) {
    if (this.ws[namespace]) {
      delete this.ws[namespace][appName];
    }
  }
}
