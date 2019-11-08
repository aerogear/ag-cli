import { AgAbstractKubePushServiceBinder } from './AgAbstractKubePushServiceBinder';

export class AgKubeAndroidPushServiceBinder extends AgAbstractKubePushServiceBinder {
  protected async createVariant(
    kube: any,
    mobileApp: any,
    pushApplication: any,
    conf: any,
  ): Promise<any> {
    const spec = { ...conf };
    delete spec.variant;

    return await kube.apis['push.aerogear.org'].v1alpha1
      .namespace(this.namespace)
      .androidvariant.post({
        body: {
          apiVersion: 'push.aerogear.org/v1alpha1',
          kind: 'AndroidVariant',
          metadata: {
            name: `${this.app}-android-ups-variant`,
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
            description: 'UPS Android Variant',
            pushApplicationId: pushApplication.body.status.pushApplicationId,
            ...spec,
          },
        },
      });
  }
}
