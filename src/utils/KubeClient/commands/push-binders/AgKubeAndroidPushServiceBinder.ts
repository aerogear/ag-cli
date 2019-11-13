import { AgAbstractKubePushServiceBinder } from './AgAbstractKubePushServiceBinder';
import { ValidatorConfig, Validator } from 'json-data-validator';
import { Notify } from '../Observer';

export class AgKubeAndroidPushServiceBinder extends AgAbstractKubePushServiceBinder {
  private getConfigValidationRules(): ValidatorConfig {
    return {
      ruleSets: [
        {
          fields: {
            variant: [
              {
                type: 'EXACT_VALUE',
                value: 'android',
              },
            ],
            serverKey: [
              {
                type: 'REQUIRED',
              },
            ],
            senderId: [
              {
                type: 'REQUIRED',
              },
            ],
          },
        },
      ],
    };
  }

  @Notify({
    pre: 'Creating new Android Variant',
    post: 'Android variant created successfully',
    fail: 'Failed creating new android variant: %s',
  })
  protected async createVariant(
    kube: any,
    mobileApp: any,
    pushApplication: any,
    conf: any,
  ): Promise<any> {
    const validator: Validator = new Validator(this.getConfigValidationRules());
    const validationRes = validator.validate(conf);
    if (!validationRes.valid) {
      console.log(validationRes.message);
      return;
    }

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
