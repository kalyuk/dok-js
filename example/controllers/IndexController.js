import {Controller} from '../../src/web/Controller';
export class IndexController extends Controller {
  indexAction() {
    return this.render(200, 'Hello World');
  }

  jsonAction() {
    return this.renderJSON(200, ['Hello World']);
  }
}