import * as fsExtra from 'fs-extra';
import { MobileApp } from '../MobileApp';

export class PushServiceConfigMgr {
  private loadP12File(config: any) {
    const filePath = config.certificate;
    const data = fsExtra.readFileSync(filePath);
    config.certificate = data.toString('base64');
  }

  addConfig(service: string, mobileApp: MobileApp, config: any) {
    const services = mobileApp.getServices();
    // get current configs for push service
    let pushServiceConfig = services.find(
      (service: any) => service.type === 'push',
    );
    if (!pushServiceConfig) {
      pushServiceConfig = {
        type: 'push',
        name: 'push',
        config: {},
      };

      services.push(pushServiceConfig);
    }

    const variant = config.variant;
    delete config.variant;

    // check if config for this variant is already present
    if (pushServiceConfig.config[variant]) {
      throw {
        message: `PushConfig for '${variant}' already bound`,
      };
    }

    if (variant === 'ios') {
      this.loadP12File(config);
    }

    pushServiceConfig.config[variant] = config;
  }
}
