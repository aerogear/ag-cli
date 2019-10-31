import { AbstractKubeCommand } from './AbstractKubeCommand';

export class AppListCommand extends AbstractKubeCommand {
  private readonly namespace: string;

  constructor(namespace: string) {
    super();
    this.namespace = namespace || this.getCurrentNamespace();
  }

  async execute(kube: any): Promise<any> {
    const result = await kube.apis['mdc.aerogear.org'].v1alpha1
      .namespace(this.namespace)
      .mobileclients.get();
    // TODO: check that status is 200
    return result.body.items;
  }
}
