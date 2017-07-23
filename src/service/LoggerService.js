import {Service} from '../base/Service';

export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  RENDER: 4
};

export class LoggerService extends Service {

  static options = {
    logLevel: LOG_LEVEL.INFO
  };

  render(type, ...args) {
    if (this.config.logLevel <= type) {
      console.log.apply(console, args); // eslint-disable-line
    }
  }
}