import { Controller, Get } from '@nestjs/common';
import { Logger } from '../../utils/logger';

@Controller('ping')
export class AppController {
  constructor() {}

  @Get()
  ping(): string {
    Logger.debug(`AppController: Ping API called.`);
    return 'Up and running!';
  }
}
