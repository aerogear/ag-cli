import * as util from 'util';
import { ora } from './OraSingleton';

/**
 * A log handler will receive the messages and will log them accordingly.
 * - pre: this is the message that will be logged before the method execution
 * - post: this is the message that will be logged if the method execution was successful
 * - fail: this is the message that will be logged if the method execution failed
 */
interface SpinnerHandler {
  /**
   * Spinner before method execution
   * @param msg
   */
  pre(msg: string): void;

  /**
   * Spinner when method execution is successful
   * @param msg
   */
  post(msg: string): void;

  /**
   * Spinner when method execution is failed.
   * @param msg
   * @param error The error
   * @param swallow if false, rethrow the error, otherwise swallow it
   */
  fail(msg: string, error: Error, swallow?: boolean): void;
}

/**
 * Interface for log messages
 */
export interface SpinnerMessage {
  pre: string;
  post: string;
  fail: string;
  swallow?: boolean;
}

class SpinnerImpl implements SpinnerHandler {
  private static INSTANCE: SpinnerImpl;

  private readonly spinner: any = ora;
  private constructor() {}

  public static getInstance() {
    if (!this.INSTANCE) {
      this.INSTANCE = new SpinnerImpl();
    }
    return this.INSTANCE;
  }

  pre = (msg: string): void => {
    this.spinner.start(msg);
  };
  post = (msg: string): void => {
    this.spinner.succeed(msg);
  };
  fail = (msg: string, error: Error, swallow: boolean = false): void => {
    // check if the exception has already been logged: if it is, the spinner is stopped.
    if (!this.spinner.isFailed()) {
      this.spinner.fail(util.format(msg, error.message));
    }
    if (!swallow) {
      throw error;
    }
  };
}

/**
 * Automatically logs a function execution. Function can't be async.
 * @param pre Message logged before executing the method
 * @param post Message logged after executing the method (if successful)
 * @param fail Message logged after executing the method (if failed)
 * @param swallow weather to rethrow the error or not
 * @constructor
 */
export function Spinner({ pre, post, fail, swallow }: SpinnerMessage) {
  return (
    target: Object,
    key: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const logHandler: SpinnerHandler = SpinnerImpl.getInstance();
      try {
        logHandler.pre(pre);
        const ret = originalMethod.apply(this, args);
        if (ret && ret.then) {
          // it is a promise
          return ret
            .then((value: any) => {
              logHandler.post(post);
              return value;
            })
            .catch((error: Error) => logHandler.fail(fail, error, !!swallow));
        }
        logHandler.post(post);
        return ret;
      } catch (error) {
        logHandler.fail(fail, error, !!swallow);
      }
    };
    return descriptor;
  };
}

export default Spinner;
