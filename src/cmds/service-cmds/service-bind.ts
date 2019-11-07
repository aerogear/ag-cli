import { Arguments, Argv } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import { KubeClient } from '../../utils/KubeClient';
import { AgKubePushBindingCommand } from '../../utils/KubeClient/commands/AgKubePushBindingCommand';

/**
 * This class implements the 'app init <appname>' command.
 * Its role is to create a new workspace initialised with the specified application name, so that it can be later pushed to the cluster.
 */
class ServiceBindCliCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('bind', 'Binds a service to an app');
    this.handler = this.handler.bind(this);
  }

  protected initCli(yargs: Argv): Argv<any> {
    return yargs
      .option('appName', {
        required: true,
        alias: 'a',
        type: 'string',
        describe: 'The name of the app to be bound',
        nargs: 1,
      })
      .option('service', {
        required: true,
        alias: 's',
        type: 'string',
        describe: 'The service to be bound',
        nargs: 1,
      })
      .option('conf', {
        alias: 'c',
        type: 'string',
        describe: 'The service configuration',
        nargs: 1,
      });
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    const name: string = yargs.appName as string;
    const namespace: string =
      (yargs.namespace as string) ||
      KubeClient.getInstance().getCurrentNamespace();
    const res = await KubeClient.getInstance().execute(
      new AgKubePushBindingCommand(namespace, name, ''),
    );
    console.log(res);
  };
}

expose(new ServiceBindCliCommand(), module);
