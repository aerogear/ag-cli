import { MobileApp } from '../model/MobileApp';

export interface WorkspaceInterface {
  exists(namespace?: string, appName?: string): boolean;
  save(app: MobileApp): Promise<void>;
  delete(namespace: string, appName: string);
  loadApplication(namespace: string, appName: string): Promise<MobileApp>;
}
