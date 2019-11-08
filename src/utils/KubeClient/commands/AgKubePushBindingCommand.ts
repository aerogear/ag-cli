import { AbstractKubeCommand } from './AbstractKubeCommand';
import { AgKubePushServiceBinderFactory } from './push-binders/AgKubePushServiceBinderFactory';

export class AgKubePushBindingCommand extends AbstractKubeCommand {
  private readonly app: string;
  private readonly namespace: string;
  private readonly conf: string;

  constructor(namespace: string, appname: string, conf: string) {
    super();
    this.app = appname;
    this.namespace = namespace || this.getCurrentNamespace();
    this.conf = conf;
  }

  execute = async (kube: any): Promise<any> => {
    return await AgKubePushServiceBinderFactory.create(
      this.namespace,
      this.app,
      this.conf,
    ).execute(kube);
  };
}
