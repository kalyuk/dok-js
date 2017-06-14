import {Controller} from '../../src/web/Controller';
import {AccessControl} from '../../src/behaviors/AccessControl';

export class AdminController extends Controller {

  getBehaviors() {
    return [{
      behavior: AccessControl
    }];
  }

  indexAction() {
    this.renderJSON(200, ['Admin render']);
  }
}