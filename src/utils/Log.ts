/**
 * A log handler will receive the messages and will log them accordingly.
 * - pre: this is the message that will be logged before the method execution
 * - post: this is the message that will be logged if the method execution was successful
 * - fail: this is the message that will be logged if the method execution failed
 */
export interface LogHandler {
  /**
   * Log before method execution
   * @param msg
   */
  pre(msg: string): void;

  /**
   * Log when method execution is successful
   * @param msg
   */
  post(msg: string): void;

  /**
   * Log when method execution is failed.
   * @param msg
   * @param error The error
   * @param swallow if false, rethrow the error, otherwise swallow it
   */
  fail(msg: string, error: Error, swallow?: boolean): void;
}

/**
 * Interface for log messages
 */
export interface LogMessages {
  pre: string;
  post: string;
  fail: string;
  swallow?: boolean;
}

/**
 * This logger is a black hole: it swallows all the messages he receives.
 */
class NullLogHandler implements LogHandler {
  pre(msg: string): void {}
  post(msg: string): void {}
  fail(msg: string, error: Error): void {}
}

/**
 * Automatically logs a function execution. Function can't be async.
 * @param pre Message logged before executing the method
 * @param post Message logged after executing the method (if successful)
 * @param fail Message logged after executing the method (if failed)
 * @param swallow weather to rethrow the error or not
 * @constructor
 */
export function Log({ pre, post, fail, swallow }: LogMessages) {
  return (
    target: Object,
    key: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const logHandler: LogHandler = this.logHandler || new NullLogHandler();
      try {
        logHandler.pre(pre);
        const ret = originalMethod.apply(this, args);
        logHandler.post(post);
        return ret;
      } catch (error) {
        logHandler.fail(fail, error, !!swallow);
      }
    };

    return descriptor;
  };
}

/**
 * Automatically logs a function execution. Function must be async.
 * @param pre Message logged before executing the method
 * @param post Message logged after executing the method (if successful)
 * @param fail Message logged after executing the method (if failed)
 * @param swallow weather to rethrow the error or not
 * @constructor
 */
export function LogAsync({ pre, post, fail, swallow }: LogMessages) {
  return (
    target: Object,
    key: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const logHandler: LogHandler = this.logHandler || new NullLogHandler();
      try {
        logHandler.pre(pre);
        const ret = await originalMethod.apply(this, args);
        logHandler.post(post);
        return ret;
      } catch (error) {
        logHandler.fail(fail, error, !!swallow);
      }
    };

    return descriptor;
  };
}
export default Log;
