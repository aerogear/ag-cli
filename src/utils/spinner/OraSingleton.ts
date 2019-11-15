import { Ora } from 'ora';
import * as oraFactory from 'ora';

//export const ora: Ora = oraFactory();

export class ora {
  static failed: boolean = false;
  static readonly spinner: Ora = oraFactory();

  public static info(message: string) {
    ora.failed = false;
    ora.spinner.info(message);
  }

  public static start(message: string) {
    ora.failed = false;
    ora.spinner.start(message);
  }
  public static succeed(message: string) {
    ora.failed = false;
    ora.spinner.succeed(message);
  }
  public static fail(message: string) {
    ora.failed = true;
    ora.spinner.fail(message);
  }

  public static isSpinning() {
    return ora.spinner.isSpinning;
  }

  public static isFailed() {
    return ora.failed;
  }
}
