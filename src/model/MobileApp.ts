import { v4 as uuid } from 'uuid';
import { WORKSPACE } from '../global';
import * as fsExtra from 'fs-extra';

/**
 * Interface representing the Kubernetes Mobile App Custom Resource Definition.
 */
interface MobileAppCrd {
  apiVersion: 'mdc.aerogear.org/v1alpha1';
  kind: 'MobileClient';
  metadata: {
    name: string;
  };
  spec: { name: string };
  status: {
    services: [];
  };
}

/**
 * Object representation of a mobile application.
 * This class is used to load and save mobile application JSON files so that they are ready to be pushed to the server.
 */
export class MobileApp {
  private readonly name: string;
  private readonly apikey: string;
  constructor(name: string) {
    this.name = name;
    this.apikey = uuid();
  }

  getName(): string {
    return this.name;
  }

  static LOAD(): MobileApp {
    const appJson = fsExtra.readJSONSync(`${WORKSPACE}/mobileapp.json`);
    return new MobileApp(appJson.metadata.name);
  }

  static SAVE(app: MobileApp): void {
    try {
      fsExtra.outputJsonSync(`${WORKSPACE}/mobileapp.json`, app.toJson());
    } catch (e) {
      throw {
        message:
          'Unable to save application into `${WORKSPACE}/mobileapp.json`',
        root: e,
      };
    }
  }

  toJson(): MobileAppCrd {
    return {
      apiVersion: 'mdc.aerogear.org/v1alpha1',
      kind: 'MobileClient',
      metadata: {
        name: this.name,
      },
      spec: {
        name: this.name,
      },
      status: {
        services: [],
      },
    };
  }
}
