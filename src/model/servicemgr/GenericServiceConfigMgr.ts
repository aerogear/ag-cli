import { MobileApp } from '../MobileApp';

export class GenericServiceConfigMgr {
  addConfig(serviceType: string, mobileApp: MobileApp, config: any) {
    const services = mobileApp.getServices();
    // get current configs for push service
    let serviceConfig = services.find(
      (service: any) => service.type === serviceType,
    );
    if (serviceConfig) {
      throw {
        message: `Service '${serviceType}' already bound`,
      };
    }

    services.push({
      name: serviceType,
      type: serviceType,
      config: config,
    });
  }
}
