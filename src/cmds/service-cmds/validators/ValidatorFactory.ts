import * as fsExtra from 'fs-extra';
import { Validator } from 'json-data-validator';
import { conf as pushValidatorConf } from './push-bind-validator-conf';
import { conf as datasyncValidatorConf } from './datasync-bind-validator-conf';

export class ValidatorFactory {
  private static readonly HOME: string = require('os').homedir() + '/.ag';

  static create(serviceType: string): Validator {
    // check if a custom validation has been put into the .ag folder
    const customServiceValidatorConf = `${ValidatorFactory.HOME}/${serviceType}-validator.json`;
    if (fsExtra.existsSync(customServiceValidatorConf)) {
      try {
        const conf = fsExtra.readJsonSync(customServiceValidatorConf);
        return new Validator(conf);
      } catch (error) {
        throw {
          message:
            `Invalid custom validator configuration provided for ${serviceType}: ` +
            error.message,
          error,
        };
      }
    }

    switch (serviceType) {
      case 'push':
        return new Validator(pushValidatorConf);
      case 'datasync':
        return new Validator(datasyncValidatorConf);
      default:
        return null;
    }
  }
}
