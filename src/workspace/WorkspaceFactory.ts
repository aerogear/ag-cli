import { WorkspaceInterface } from './WorkspaceInterface';
import { FSWorkspace, InMemoryWorkspace } from './impl';

export abstract class WorkspaceFactory {
  public static create(type: string): WorkspaceInterface {
    switch (type) {
      case 'fs':
        return new FSWorkspace();
      case 'mem':
        return new InMemoryWorkspace();
      default:
        throw {
          message: `Unsupported workspace type: ${type}`,
        };
    }
  }
}
