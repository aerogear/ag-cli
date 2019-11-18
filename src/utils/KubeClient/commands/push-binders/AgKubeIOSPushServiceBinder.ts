import { AgAbstractKubePushServiceBinder } from './AgAbstractKubePushServiceBinder';

export class AgKubeIOSPushServiceBinder extends AgAbstractKubePushServiceBinder {
  protected async createVariant(
    kube: any,
    mobileApp: any,
    pushApplication: any,
    conf: any,
  ): Promise<any> {
    const spec = { ...conf };
    delete spec.variant;

    spec.production = spec.production === true || spec.production === 'true';

    return await kube.apis['push.aerogear.org'].v1alpha1
      .namespace(this.namespace)
      .iosvariant.post({
        body: {
          apiVersion: 'push.aerogear.org/v1alpha1',
          kind: 'IOSVariant',
          metadata: {
            name: `${this.app}-ios-ups-variant`,
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
            description: 'UPS iOS Variant',
            pushApplicationId: pushApplication.body.status.pushApplicationId,
            ...spec,
          },
        },
      });
  }
}
