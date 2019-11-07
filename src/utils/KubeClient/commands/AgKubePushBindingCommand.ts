import { AbstractKubeCommand } from './AbstractKubeCommand';
import { KubeClient } from '../KubeClient';
import { AgKubePullCommand } from './AgKubePullCommand';
import { poll } from '../../polling/polling';

export class AgKubePushBindingCommand extends AbstractKubeCommand {
  private readonly app: string;
  private readonly namespace: string;
  private readonly conf: string;

  constructor(namespace: string, appname: string, conf: string) {
    super();
    this.app = appname;
    this.namespace = namespace || this.getCurrentNamespace();
    this.conf = conf;
  }

  private async createPushApplication(kube: any, owner: any): Promise<any> {
    try {
      return await kube.apis['push.aerogear.org'].v1alpha1
        .namespace(this.namespace)
        .pushapplication.post({
          body: {
            apiVersion: 'push.aerogear.org/v1alpha1',
            kind: 'PushApplication',
            metadata: {
              name: `${this.app}`,
              ownerReferences: [
                {
                  apiVersion: owner.apiVersion,
                  kind: owner.kind,
                  blockOwnerDeletion: false,
                  name: owner.metadata.name,
                  uid: owner.metadata.uid,
                },
              ],
            },
            spec: {
              description: 'MDC Push Application',
            },
          },
        });
    } catch (error) {
      // Looks like the push application is not there.
      // Let's try to create it and then retry this.
      console.log('error', error);
    }
  }

  private async getPushApplication(kube: any, owner: any): Promise<any> {
    try {
      const pushApp = await kube.apis['push.aerogear.org'].v1alpha1
        .namespace(this.namespace)
        .pushapplication(this.app)
        .get();
      // if (!(pushApp.body.status && pushApp.body.status.pushApplicationId)) {
      //   console.log('App is there but is not ready. Retrying....');
      //   return await this.getPushApplication(kube, owner);
      // }
      return pushApp;
    } catch (error) {
      // Looks like the push application is not there.
      // Let's try to create it and then retry this.
      await this.createPushApplication(kube, owner);
      return await this.getPushApplication(kube, owner);
    }
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
    console.log({ app: this.app, namespace: this.namespace });
    const mobileApp = (await this.pullMobileApp()).body;
    console.log(mobileApp);
    const pushApp = await poll(
      async () => await this.getPushApplication(kube, mobileApp),
      (pushApp: any) =>
        !!(pushApp.body.status && pushApp.body.status.pushApplicationId),
      1000,
      10000,
      'Timeout waiting for a pushApplicationId to be assigned to the newly created app',
    );
    // We now have the push application. We can now create the variant.

    return pushApp;
  };
}
