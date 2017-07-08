import {Service} from '../base/Service';
import {LOG_LEVEL} from './LoggerService';

export class ResponseConsoleService extends Service {
  constructor(loggerService) {
    super();
    this.loggerService = loggerService;
  }

  render(data) {
    return this.loggerService.render(LOG_LEVEL.RENDER, data.body);
  }
}