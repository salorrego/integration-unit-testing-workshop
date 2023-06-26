/* eslint-disable @typescript-eslint/no-explicit-any */
import { get } from '../../../../config/convict';
import Pino from 'pino';
import { Logger } from '../interfaces/Logger';

export class PinoLogger implements Logger {
  private log: any;

  constructor() {
    this.log = Pino({
      level: get('server.logLevel'),
      enabled: process.env.LOG_ENABLED != 'false',
    });
  }

  public debug(message: any): void {
    this.log.debug(message);
  }

  public error(message: any): void {
    this.log.error(message);
  }

  public info(message: any): void {
    this.log.info(message);
  }

  public critical(message: any): void {
    this.log.critical(message);
  }

  public warn(message: any): void {
    this.log.warn(message);
  }
}
