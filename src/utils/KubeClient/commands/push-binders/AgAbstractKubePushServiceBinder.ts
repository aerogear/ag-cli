import { AbstractKubeCommand } from '../AbstractKubeCommand';
import { poll } from '../../../polling/polling';
import { KubeClient } from '../../KubeClient';
import { AgKubePullCommand } from '../AgKubePullCommand';
import { Notify } from '../Observer';

export abstract class AgAbstractKubePushServiceBinder extends AbstractKubeCommand {
  protected readonly app: string;
  protected readonly namespace: string;
  protected readonly conf: any;

  public constructor(namespace: string, appname: string, conf: string) {
    super();
    this.app = appname;
    this.namespace = namespace || this.getCurrentNamespace();
    this.conf = JSON.parse(conf);
  }

  @Notify({
    pre: 'Pulling mobile app from the cluster',
    post: 'Mobile app pulled successfully',
    fail: 'Error pulling mobile app: %s',
  })
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

  @Notify({
    pre: 'Creating new push application',
    post: 'Push application created successfully',
    fail: 'Error creating mobile app: %s',
  })
  private async createPushApplication(kube: any, mobileApp: any): Promise<any> {
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
                apiVersion: mobileApp.apiVersion,
                kind: mobileApp.kind,
                blockOwnerDeletion: false,
                name: mobileApp.metadata.name,
                uid: mobileApp.metadata.uid,
              },
            ],
          },
          spec: {
            description: 'MDC Push Application',
          },
        },
      });
  }

  private async getOrCreatePushApplication(
    kube: any,
    mobileApp: any,
  ): Promise<any> {
    try {
      return await kube.apis['push.aerogear.org'].v1alpha1
        .namespace(this.namespace)
        .pushapplication(this.app)
        .get();
    } catch (error) {
      // Looks like the push application is not there.
      // Let's try to create it and then retry this.
      await this.createPushApplication(kube, mobileApp);
      return await this.getOrCreatePushApplication(kube, mobileApp);
    }
  }

  @Notify({
    pre: 'Getting push application',
    post: 'Push application pulled successfully',
    fail: 'Error getting the push application: %s',
  })
  private async getPushApplication(kube: any, mobileApp: any): Promise<any> {
    return await poll(
      async () => await this.getOrCreatePushApplication(kube, mobileApp),
      (pushApp: any) =>
        !!(pushApp.body.status && pushApp.body.status.pushApplicationId),
      1000,
      10000,
      'Timeout waiting for a pushApplicationId to be assigned to the newly created app',
    );
  }

  protected abstract async createVariant(
    kube: any,
    mobileApp: any,
    pushApplication: any,
    conf: any,
  ): Promise<any>;

  execute = async (kube: any): Promise<any> => {
    const mobileApp = await this.pullMobileApp();
    const pushApp = await this.getPushApplication(kube, mobileApp);
    // We now have the push application. We can now create the variant.
    return await this.createVariant(kube, mobileApp, pushApp, this.conf);
    // TODO: we should now update the mobileapp with the new bound services. For the moment we will rely to the MDC
    // server.js to update it.
  };
}
