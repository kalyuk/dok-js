import {Controller as BaseController} from '../base/Controller';

export class Controller extends BaseController {

  render(status, content) {
    return {
      body: content,
      headers: {},
      status
    };
  }
}