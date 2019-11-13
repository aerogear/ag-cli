import { Arguments, Argv } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import { KubeClient } from '../../utils/KubeClient';
import { AgKubePushBindingCommand } from '../../utils/KubeClient/commands/AgKubePushBindingCommand';
import { ValidatorFactory } from './validators/ValidatorFactory';
import {
  Message,
  MESSAGE_TYPE,
  Observer,
} from '../../utils/KubeClient/commands/Observer';
import { ora } from '../../utils/spinner/OraSingleton';
import { Spinner } from '../../utils/spinner';
import { KubeCommand } from '../../utils/KubeClient/KubeClient';
import { AgKubeDataSyncBindingCommand } from '../../utils/KubeClient/commands/AgKubeDataSyncBindingCommand';
import { AbstractKubeCommand } from '../../utils/KubeClient/commands/AbstractKubeCommand';

/**
 * This class implements the 'app init <appname>' command.
 * Its role is to create a new workspace initialised with the specified application name, so that it can be later pushed to the cluster.
 */
class ServiceBindCliCommand extends AbstractNamespaceScopedCommand
  implements Observer {
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

  @Spinner({
    pre: 'Binding service to the mobileapp',
    post: 'Service bound to the mobileapp',
    fail: 'Error binding service to the mobileapp: %s',
    swallow: true,
  })
  private async bindService(
    namespace: string,
    appname: string,
    service: string,
    conf: string,
  ) {
    // Validate the configuration
    // FIXME: check that the passed in configuration is a JSON file
    const validator = ValidatorFactory.create(service);
    if (validator) {
      const validationRes = validator.validate(JSON.parse(conf || '{}'));
      if (!validationRes.valid) {
        throw {
          message: validationRes.message,
        };
      }
    }

    let cmd: AbstractKubeCommand;

    switch (service) {
      case 'push':
        cmd = new AgKubePushBindingCommand(namespace, appname, conf);
        break;
      case 'datasync':
        cmd = new AgKubeDataSyncBindingCommand(
          namespace,
          appname,
          JSON.parse(conf),
        );
    }

    cmd.registerObserver(this);

    return await KubeClient.getInstance().execute(cmd);
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    const name: string = yargs.appName as string;
    const namespace: string =
      (yargs.namespace as string) ||
      KubeClient.getInstance().getCurrentNamespace();

    await this.bindService(
      namespace,
      name,
      yargs.service as string,
      yargs.conf as string,
    );
  };

  receiveNotification(message: Message) {
    switch (message.type) {
      case MESSAGE_TYPE.INFO:
        ora.info(message.message);
        break;
      case MESSAGE_TYPE.PROGRESS:
        ora.start(message.message);
        break;
      case MESSAGE_TYPE.SUCCESS:
        ora.succeed(message.message);
        break;
      case MESSAGE_TYPE.ERROR:
        ora.fail(message.message);
    }
  }
}

expose(new ServiceBindCliCommand(), module);
