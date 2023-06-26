import { CustomLogger as CutomLoggerDeclaration } from './NestLoggerWrapper/CustomLogger';
import { PinoLogger } from './PinoLogger/PinoLogger';

// NodeJS' singleton
export const Logger = new PinoLogger();
export const CustomLogger = new CutomLoggerDeclaration(Logger);
