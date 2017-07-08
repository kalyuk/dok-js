import {Controller} from '../base/Controller';
import {ResponseService} from '../service/ResponseService';

export class WebController extends Controller {

  renderJSON(status, json, code = 'success', message = false) {
    const data = {};

    if (status > 300 && code === 'success') {
      throw new Error('Wrong response code');
    }

    data.code = code;
    if (message) {
      data.message = message;
    }
    data[status < 300 ? 'data' : 'errors'] = json;

    return {
      body: JSON.stringify(data),
      headers: {
        'Content-type': ResponseService.types.json
      },
      status
    };
  }
}