import { AbstractKubeCommand } from './AbstractKubeCommand';
import { MobileApp } from '../../../model/MobileApp';

export class AppPushCommand extends AbstractKubeCommand {
  private readonly app: MobileApp;
  private readonly namespace: string;

  constructor(app: MobileApp, namespace: string) {
    super();
    this.app = app;
    this.namespace = namespace || this.getCurrentNamespace();
  }

  execute = async (kube: any): Promise<any> => {
    return await kube.apis['mdc.aerogear.org'].v1alpha1
      .namespace(this.namespace)
      .mobileclient.post({
        body: this.app.namespace(this.namespace).toJson(),
      });
  };
}
