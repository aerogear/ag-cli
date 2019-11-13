import * as util from 'util';
import { Observable } from './Observable';

export enum MESSAGE_TYPE {
  PROGRESS,
  INFO,
  ERROR,
  SUCCESS,
}

export interface Message {
  type: MESSAGE_TYPE;
  message: string;
}

export interface Observer {
  receiveNotification(message: Message);
}

interface NotifyMessage {
  pre: string;
  post: string;
  fail: string;
  swallow?: boolean;
}

export function Notify({ pre, post, fail, swallow }: NotifyMessage) {
  return (
    target: Object,
    key: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const observer: Observable = this;
      try {
        observer.notify({
          type: MESSAGE_TYPE.PROGRESS,
          message: pre,
        });
        const ret = originalMethod.apply(this, args);
        if (ret && ret.then) {
          // it is a promise
          return ret
            .then((value: any) => {
              observer.notify({
                type: MESSAGE_TYPE.SUCCESS,
                message: post,
              });
              return value;
            })
            .catch((error: Error) => {
              observer.notify({
                type: MESSAGE_TYPE.ERROR,
                message: util.format(fail, error.message),
              });
              throw error;
            });
        }
        observer.notify({
          type: MESSAGE_TYPE.SUCCESS,
          message: post,
        });
        return ret;
      } catch (error) {
        observer.notify({
          type: MESSAGE_TYPE.ERROR,
          message: util.format(fail, error.message),
        });
      }
    };
    return descriptor;
  };
}
