import {Controller as BaseController} from '../base/Controller';
import {ResponseService} from './ResponseService';

export class Controller extends BaseController {

  renderJSON(status, content, code = 'success', message = '') {
    const data = {};

    if (status > 300 && code === 'success') {
      throw new Error('Wrong response code');
    }

    data.code = code;
    data.message = message;
    data[status < 300 ? 'data' : 'errors'] = content;

    return {
      body: JSON.stringify(data),
      headers: {
        'Content-type': ResponseService.types.json
      },
      status
    };
  }

}