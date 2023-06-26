import { PinoLogger } from '../PinoLogger/PinoLogger';

export class CustomLogger {
  logger: any;

  constructor(logger: PinoLogger) {
    this.logger = logger;
  }

  log(message: string) {
    this.logger.info(message);
  }
  error(message: string, trace: string) {
    this.logger.error(`${message}, ${trace}`);
  }
  warn(message: string) {
    this.logger.wanr(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  verbose(message: string) {
    this.logger.verbose(message);
  }
}
