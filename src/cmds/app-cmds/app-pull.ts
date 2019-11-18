import { Arguments, Argv } from 'yargs';
import * as inquirer from 'inquirer';
import { Answers } from 'inquirer';
import { AbstractNamespaceScopedCommand, expose } from '../command-interface';
import { AgKubePullCommand, KubeClient } from '../../utils/KubeClient';
import { MobileApp } from '../../model/MobileApp';
import { Spinner } from '../../utils/spinner';

class AppPullCommand extends AbstractNamespaceScopedCommand {
  constructor() {
    super(
      'pull <name>',
      'Pulls an application from the cluster to the local workspace',
    );
  }

  protected initCli(yargs: Argv): Argv<any> {
    return yargs.positional('name', {
      describe: 'the name of the app to be pulled',
      type: 'string',
    });
  }

  @Spinner({
    pre: 'Pulling application from the cluster',
    post: 'Application pulled successfully',
    fail: 'Error pulling the application from the cluster: %s',
    swallow: true,
  })
  private async pull(namespace: string, appname: string): Promise<void> {
    const cl: KubeClient = await KubeClient.getInstance();
    const res = await cl.execute(new AgKubePullCommand(appname, namespace));
    // FIXME: check that the status code (res.statusCode) is 200
    await this.workspace.save(new MobileApp(res));
  }

  public handler = async (yargs: Arguments): Promise<void> => {
    const cl: KubeClient = await KubeClient.getInstance();
    const appName = yargs.name as string;
    const namespace = (yargs.namespace as string) || cl.getCurrentNamespace();

    if (!yargs.force && this.workspace.exists(namespace, appName)) {
      const answers: Answers = await inquirer.prompt([
        {
          name: 'overwriteApp',
          type: 'confirm',
          message: `An application named ${appName} with namespace ${namespace} already exists in the workspace. If you continue it will be overwritten. Are you sure you want to continue ?`,
          default: false,
        },
      ]);
      if (!answers.overwriteApp) {
        return;
      }
    }

    this.pull(yargs.namespace as string, yargs.name as string);
  };
}

expose(new AppPullCommand(), module);
