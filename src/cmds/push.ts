import { AbstractNamespaceScopedCommand, expose } from './command-interface';
import { Arguments } from 'yargs';
import { KubeConfig } from '@kubernetes/client-node';
import * as Request from 'kubernetes-client/backends/request';
import { MobileApp } from '../model/MobileApp';

const mobileClientCRD = require('../model/crds/mobile-client-crd.json');
const pushApplicationCRD = require('../model/crds/push-application-crd.json');
const androidVariantCRD = require('../model/crds/android-variant-crd.json');
const iosVariantCRD = require('../model/crds/ios-variant-crd.json');
const mobileSecurityService = require('../model/crds/mobile-security-crd.json');

const { Client } = require('kubernetes-client');

async function initKubeClient() {
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
  return kubeclient;
}

/**
 * This class implements the 'push' command, whose role is to push local changes to the server.
 */
class PushCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('push', 'Pushes all local resources in .ag folder into a namespace');
  }

  private getCurrentNamespace(kubeconfig: KubeConfig): string {
    const context: string = kubeconfig.getCurrentContext();
    if (context && context.includes('/')) {
      return context.split('/', 1)[0];
    }

    return context;
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const namespace = yargs.namespace || this.getCurrentNamespace(kc);
    const mobileApp: MobileApp = MobileApp.LOAD();
    try {
      const kubeclient = await initKubeClient();
      await kubeclient.apis['mdc.aerogear.org'].v1alpha1
        .namespace(namespace)
        .mobileclient.post({
          body: mobileApp.toJson(),
        });
      console.log(`Mobile app "${mobileApp.getName()}" created`);
    } catch (e) {
      console.error(
        `Failed creating app "${mobileApp.getName()}": ${e.message}`,
      );
    }
  };
}

expose(new PushCommand(), module);
