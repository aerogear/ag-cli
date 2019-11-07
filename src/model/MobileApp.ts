import { v4 as uuid } from 'uuid';
import { SerializableInterface } from './SerializableInterface';

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
    clientId: string;
    namespace: string;
    services: [];
  };
}

/**
 * Object representation of a mobile application.
 * This class is used to load and save mobile application JSON files so that they are ready to be pushed to the server.
 */
export class MobileApp implements SerializableInterface {
  private readonly name: string;
  private readonly apikey: string;
  private ns: string;

  constructor(name: string | any, namespace?: string) {
    if (!namespace) {
      // we received the definition of the app
      const appDef = name;
      this.name = appDef.metadata.name;
      this.ns = appDef.metadata.namespace;
    } else {
      this.name = name;
      this.ns = namespace;
    }
    this.apikey = uuid();
  }

  getName(): string {
    return this.name;
  }

  getNameSpace(): string {
    return this.ns;
  }

  /**
   * Utility method to change the MobileApp namespace on the fly so that it can be chained.
   * @param ns the new namespace
   */
  namespace(ns: string): MobileApp {
    this.ns = ns;
    return this;
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
        clientId: this.name,
        namespace: this.ns,
        services: [],
      },
    };
  }
}
