import { Arguments, Argv } from 'yargs';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import { AgKubePullCommand, KubeClient } from '../../utils/KubeClient';

class AppPullCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super('pull <name>', 'Pulls a mobile client');
  }

  protected initCli(yargs: Argv): Argv<any> {
    return yargs.positional('name', {
      describe: 'the name of the app to be deleted',
      type: 'string',
    });
  }

  private async pull(namespace: string, appname: string): Promise<void> {
    const cl: KubeClient = await KubeClient.getInstance();
    console.log(
      'app2:',
      JSON.stringify(
        await cl.execute(new AgKubePullCommand(appname, namespace)),
      ),
    );
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    this.pull(yargs.namespace as string, yargs.name as string);
  };
}

expose(new AppPullCommand(), module);
