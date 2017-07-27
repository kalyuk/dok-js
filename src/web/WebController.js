import {Controller} from '../base/Controller';
import {ResponseService} from '../service/ResponseService';
import path from 'path';
import {getService} from '../index';

export class WebController extends Controller {

  renderPUG(status, template, data) {
    const viewPath = path.join(this.$module.getId(), this.id, template);
    return this.render(status, getService('PugService').render(viewPath, data));
  }

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