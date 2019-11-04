import { KubeConfig } from '@kubernetes/client-node';
import * as Request from 'kubernetes-client/backends/request';
import { MobileApp } from '../../model/MobileApp';
const { Client } = require('kubernetes-client');

const mobileClientCRD = require('../../model/crds/mobile-client-crd.json');
const pushApplicationCRD = require('../../model/crds/push-application-crd.json');
const androidVariantCRD = require('../../model/crds/android-variant-crd.json');
const iosVariantCRD = require('../../model/crds/ios-variant-crd.json');
const mobileSecurityService = require('../../model/crds/mobile-security-crd.json');

export interface KubeCommand {
  execute(kube: KubeClient): any;
}

/**
 * Kubernetes client wrapper.
 * This class is a singleton that will expose a simplified interface to access aerogear openshift cluster.
 */
export class KubeClient {
  private static instance: KubeClient;

  protected kube: any;
  protected readonly kubeConfig: KubeConfig;

  protected constructor() {
    this.kubeConfig = new KubeConfig();
    this.kubeConfig.loadFromDefault();
  }

  private async initKubeClient() {
    if (this.kube) {
      return;
    }
    const kubeconfig = new KubeConfig();
    if (process.env.NODE_ENV === 'production') {
      kubeconfig.loadFromCluster();
    } else {
      kubeconfig.loadFromDefault();
    }
    const backend = new Request({ kubeconfig });

    if (process.env.INSECURE_SERVER) {
      backend.requestOptions.strictSSL = false;
    }

    const kubeclient = new Client({ backend });
    await kubeclient.loadSpec();
    kubeclient.addCustomResourceDefinition(mobileClientCRD);
    kubeclient.addCustomResourceDefinition(pushApplicationCRD);
    kubeclient.addCustomResourceDefinition(androidVariantCRD);
    kubeclient.addCustomResourceDefinition(iosVariantCRD);
    kubeclient.addCustomResourceDefinition(mobileSecurityService);
    this.kube = kubeclient;
  }

  /**
   * Returns a singleton instance of this object.
   */
  // tslint:disable-next-line: function-name
  public static getInstance(): KubeClient {
    if (!KubeClient.instance) {
      KubeClient.instance = new KubeClient();
    }
    return KubeClient.instance;
  }

  public getCurrentNamespace(): string {
    const context: string = this.kubeConfig.getCurrentContext();
    if (context && context.includes('/')) {
      return context.split('/', 1)[0];
    }

    return context;
  }

  public async execute(command: KubeCommand): Promise<any> {
    await this.initKubeClient();
    return await command.execute(this.kube);
  }
}

export class PushCommand implements KubeCommand {
  private readonly app: MobileApp;
  private readonly namespace: string;
  private readonly kubeConfig: KubeConfig = new KubeConfig();

  constructor(app: MobileApp, namespace: string) {
    this.kubeConfig.loadFromDefault();
    this.app = app;
    this.namespace = namespace || this.getCurrentNamespace();
  }

  public getCurrentNamespace(): string {
    const context: string = this.kubeConfig.getCurrentContext();
    if (context && context.includes('/')) {
      return context.split('/', 1)[0];
    }

    return context;
  }

  async execute(kube: any): Promise<any> {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    return await kube.apis['mdc.aerogear.org'].v1alpha1
      .namespace(this.namespace)
      .mobileclient.post({
        body: this.app.namespace(this.namespace).toJson(),
      });
  }
}
