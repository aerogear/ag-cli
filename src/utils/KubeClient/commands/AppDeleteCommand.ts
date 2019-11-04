import { AbstractKubeCommand } from './AbstractKubeCommand';

export class AppDeleteCommand extends AbstractKubeCommand {
  private readonly namespace: string;
  private readonly appName: string;

  constructor(appname: string, namespace: string) {
    super();
    this.namespace = namespace || this.getCurrentNamespace();
    this.appName = appname;
  }

  async execute(kube: any): Promise<any> {
    const result = await kube.apis['mdc.aerogear.org'].v1alpha1
      .namespace(this.namespace)
      .mobileclient(this.appName)
      .delete();
    return result.body.items;
  }
}
