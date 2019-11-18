import { AbstractNamespaceScopedCommand, expose } from './command-interface';
import { Arguments, Argv } from 'yargs';
import { ora } from '../utils/spinner/OraSingleton';

import {
  KubeClient,
  AppPushCommand,
  AgKubePullCommand,
} from '../utils/KubeClient';
import { MobileApp } from '../model/MobileApp';
import { Spinner } from '../utils/spinner';
import { KubeCommand } from '../utils/KubeClient/KubeClient';
import { AgKubePushBindingCommand } from '../utils/KubeClient/commands/AgKubePushBindingCommand';

/**
 * This class implements the 'push' command, whose role is to push local changes to the server.
 */
class PushCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super(
      'push <appname>',
      'Pushes an application into a namespace to the cluster',
    );
  }

  protected initCli(yargs: Argv): Argv<any> {
    return yargs.positional('name', {
      describe: 'the name of the app to be pushed',
      type: 'string',
    });
  }

  @Spinner({
    pre: 'Checking if the application exists in the cluster',
    post: 'Application already exists in the cluster',
    fail: 'Application does not exists in the cluster (%s)',
    swallow: true,
  })
  private async pullApplication(mobileApp: MobileApp) {
    const cl: KubeClient = await KubeClient.getInstance();
    return await cl.execute(
      new AgKubePullCommand(mobileApp.getName(), mobileApp.getNameSpace()),
    );
  }

  @Spinner({
    pre: 'Pushing application to the cluster',
    post: 'Application pushed successfully',
    fail: 'Error pushing the application to the cluster: %s',
    swallow: true,
  })
  private async pushApplication(mobileApp: MobileApp): Promise<void> {
    const cl: KubeClient = await KubeClient.getInstance();
    await cl.execute(new AppPushCommand(mobileApp, mobileApp.getNameSpace()));
  }

  @Spinner({
    pre: 'Binding service to the application',
    post: 'Service bound successfully',
    fail: 'Error binding the service to the application: %s',
    swallow: true,
  })
  private async bindService(
    mobileApp: MobileApp,
    service: string,
    serviceConf: { [key: string]: string },
  ) {
    const cl: KubeClient = await KubeClient.getInstance();
    let kc: KubeCommand;
    switch (service) {
      case 'push':
        kc = new AgKubePushBindingCommand(
          mobileApp.getNameSpace(),
          mobileApp.getName(),
          JSON.stringify(serviceConf),
        );
        break;
      default:
        console.log(`ignoring service ${service}`);
        return;
    }

    await cl.execute(kc);
  }

  private async asyncForEach(
    array: any[],
    callback: (value: any, index?: number, array?: any[]) => void,
  ) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    const cl: KubeClient = await KubeClient.getInstance();
    let mobileApp = await this.workspace.loadApplication(
      (yargs.namespace as string) || cl.getCurrentNamespace(),
      yargs.appname as string,
    );

    if (!(await this.pullApplication(mobileApp))) {
      await this.pushApplication(mobileApp);
    }

    // binding the services...
    const services = mobileApp.getServices();
    if (services && services.length > 0) {
      await this.asyncForEach(services, async (srv: any) => {
        if (srv.type === 'push') {
          // loop through configs...
          await this.asyncForEach(
            Object.keys(srv.config),
            async (variant: string) => {
              const cfg = { ...srv.config[variant], variant };
              // Now we can make the binding...
              await this.bindService(mobileApp, srv.type, cfg);
            },
          );
        }
      });
    }
    mobileApp.getServices().forEach((service: any) => {});
  };
}

expose(new PushCommand(), module);
