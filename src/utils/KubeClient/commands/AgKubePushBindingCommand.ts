import { AbstractKubeCommand } from './AbstractKubeCommand';
import { AgKubePushServiceBinderFactory } from './push-binders/AgKubePushServiceBinderFactory';
import { Observer } from './Observer';

export class AgKubePushBindingCommand extends AbstractKubeCommand {
  private readonly app: string;
  private readonly namespace: string;
  private readonly conf: string; // TODO: change this to a JSON object

  constructor(namespace: string, appname: string, conf: string) {
    super();
    this.app = appname;
    this.namespace = namespace || this.getCurrentNamespace();
    this.conf = conf;
  }

  execute = async (kube: any): Promise<any> => {
    const delegate = AgKubePushServiceBinderFactory.create(
      this.namespace,
      this.app,
      this.conf,
    );

    this.observers.forEach((observer: Observer) =>
      delegate.registerObserver(observer),
    );

    return delegate.execute(kube);
  };
}
