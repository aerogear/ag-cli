import { AbstractKubeCommand } from './AbstractKubeCommand';
import { KubeClient } from '../KubeClient';
import { AgKubePullCommand } from './AgKubePullCommand';

export class AgKubeDataSyncBindingCommand extends AbstractKubeCommand {
  private readonly app: string;
  private readonly namespace: string;
  private readonly conf: { [key: string]: string | number };

  constructor(
    namespace: string,
    appname: string,
    conf: { [key: string]: string | number },
  ) {
    super();
    this.app = appname;
    this.namespace = namespace || this.getCurrentNamespace();
    this.conf = conf;
  }

  private async pullMobileApp() {
    try {
      return await KubeClient.getInstance().execute(
        new AgKubePullCommand(this.app, this.namespace),
      );
    } catch (error) {
      throw {
        message: `Unable to pull application ${this.app} from namespace ${this.namespace}: ${error.message}`,
        error,
      };
    }
  }

  execute = async (kube: any): Promise<any> => {
    const mobileApp = (await this.pullMobileApp()).body;

    const spec = { ...this.conf };
    delete spec.variant;

    return await kube.api.v1.namespace(this.namespace).configmaps.post({
      body: {
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: {
          name: `${this.app}-data-sync-binding`,
          ownerReferences: [
            {
              apiVersion: mobileApp.apiVersion,
              kind: mobileApp.kind,
              blockOwnerDeletion: false,
              name: mobileApp.metadata.name,
              uid: mobileApp.metadata.uid,
            },
          ],
        },
        data: this.conf,
      },
    });
  }
}
