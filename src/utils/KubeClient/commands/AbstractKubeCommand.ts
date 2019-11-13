import { KubeConfig } from '@kubernetes/client-node';
import { KubeCommand } from '../KubeClient';
import { Observable } from './Observable';
import { Message, Observer } from './Observer';

export abstract class AbstractKubeCommand implements KubeCommand, Observable {
  protected readonly observers: Observer[] = [];
  private readonly kubeConfig: KubeConfig = new KubeConfig();

  protected constructor() {
    this.kubeConfig.loadFromDefault();
  }

  public getCurrentNamespace(): string {
    const context: string = this.kubeConfig.getCurrentContext();
    if (context && context.includes('/')) {
      return context.split('/', 1)[0];
    }

    return context;
  }

  protected getKubeConfig = () => this.kubeConfig;

  abstract async execute(kube: any): Promise<any>;

  readonly registerObserver = (observer: Observer) => {
    this.observers.push(observer);
  };

  readonly removeObserver = (observer: Observer) => {
    const observerIndex = this.observers.indexOf(observer);
    this.observers.splice(observerIndex, 1);
  };

  public readonly notify = (message: Message) => {
    this.observers.forEach((observer: Observer) =>
      observer.receiveNotification(message),
    );
  };
}
