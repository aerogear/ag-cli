import { Validator } from 'json-data-validator';
import { conf as pushValidatorConf } from './push-bind-validator-conf';

export class ValidatorFactory {
  static create(serviceType: string): Validator {
    switch (serviceType) {
      case 'push':
        return new Validator(pushValidatorConf);
      default:
        return null;
    }
  }
}
