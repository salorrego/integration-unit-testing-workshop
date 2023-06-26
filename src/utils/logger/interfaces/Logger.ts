/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
  info(message: any): void;
  debug(message: any): void;
  error(message: any): void;
  critical(message: any): void;
}
