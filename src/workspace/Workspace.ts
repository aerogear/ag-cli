import { MobileApp } from '../model/MobileApp';
import { WorkspaceFactory } from './WorkspaceFactory';
import { WorkspaceInterface } from './WorkspaceInterface';

/**
 * This class is responsible of managing the workspace.
 * Demands the construction of the real workspace manager class to the WorkspaceFactory.
 */
export abstract class Workspace implements WorkspaceInterface {
  public static DEFAULT_WORKSPACE_TYPE: string = 'fs';

  private static readonly INSTANCES: any = {};
  /**
   * If no namespace and appName are provided, checks if the workspace exists.
   * Otherwise checks if the namespace or (if provided) the app exist.
   */
  public abstract exists(namespace?: string, appName?: string): boolean;

  /**
   * Lists all the applications in a given namespace
   * @param namespace
   */
  public abstract async list(namespace: string): Promise<string[]>;

  /**
   * Saves an the application into the workspace
   * @param app the application to be saved
   */
  public abstract async save(app: MobileApp): Promise<void>;

  public abstract async delete(
    namespace: string,
    appName: string,
  ): Promise<void>;

  /**
   * Loads an application from the workspace
   * @param namespace
   * @param appName
   */
  public abstract async loadApplication(
    namespace: string,
    appName: string,
  ): Promise<MobileApp>;

  /**
   * Returns an instance of the workspace (singleton)
   * @param type the type of workspace to be returned. Defaults to 'fs'
   */
  public static getInstance(type?: string): Workspace {
    type = type || Workspace.DEFAULT_WORKSPACE_TYPE;
    if (!Workspace.INSTANCES[type]) {
      Workspace.INSTANCES[type] = WorkspaceFactory.create(type);
    }
    return Workspace.INSTANCES[type];
  }
}
