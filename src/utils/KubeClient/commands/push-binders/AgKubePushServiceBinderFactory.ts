import { AbstractKubeCommand } from '../AbstractKubeCommand';
import { AgKubeAndroidPushServiceBinder } from './AgKubeAndroidPushServiceBinder';
import { AgKubeIOSPushServiceBinder } from './AgKubeIOSPushServiceBinder';

export class AgKubePushServiceBinderFactory {
  private constructor() {}

  public static create(
    namespace: string,
    appName: string,
    conf: string,
  ): AbstractKubeCommand {
    const configuration = JSON.parse(conf);

    switch (configuration.variant) {
      case 'android':
        return new AgKubeAndroidPushServiceBinder(namespace, appName, conf);
      case 'ios':
        return new AgKubeIOSPushServiceBinder(namespace, appName, conf);
      default:
        throw { message: `Unknown variant type: '${configuration.variant}'` };
    }
  }
}
