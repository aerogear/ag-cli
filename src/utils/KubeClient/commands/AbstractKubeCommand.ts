import { KubeConfig } from '@kubernetes/client-node';
import { KubeCommand } from '../KubeClient';

export abstract class AbstractKubeCommand implements KubeCommand {
  private readonly kubeConfig: KubeConfig = new KubeConfig();

  protected constructor() {
    this.kubeConfig.loadFromDefault();
  }

  public getCurrentNamespace(): string {
    const context: string = this.kubeConfig.getCurrentContext();
    if (context && context.includes('/')) {
      return context.split('/', 1)[0];
    }

    return context;
  }

  protected getKubeConfig = () => this.kubeConfig;

  abstract async execute(kube: any): Promise<any>;
}
