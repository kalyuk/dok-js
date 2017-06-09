import {Service} from '../base/Service';
import {getApplication} from '../../index';
import {LOG_LEVEL} from '../base/LoggerService';

export class ResponseService extends Service {
  render(ctx) {
    return getApplication().log(LOG_LEVEL.RENDER, ctx.content.body);
  }
}