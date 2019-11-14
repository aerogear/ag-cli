import { AbstractKubeCommand } from './AbstractKubeCommand';

export class AgKubePullCommand extends AbstractKubeCommand {
  private readonly app: string;
  private readonly namespace: string;

  constructor(appname: string, namespace: string) {
    super();
    this.app = appname;
    this.namespace = namespace || this.getCurrentNamespace();
  }

  execute = async (kube: any): Promise<any> => {
    return await kube.apis['mdc.aerogear.org'].v1alpha1
      .namespace(this.namespace)
      .mobileclient(this.app)
      .get();
  };
}
