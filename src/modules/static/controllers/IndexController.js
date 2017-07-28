import {WebController} from '../../../web/WebController';
import * as path from 'path';

export class IndexController extends WebController {

  indexAction(ctx) {
    const filePath = path.join(ctx.route.viewPath, ctx.route.filePath.split('?')[0]);
    const fp = path.normalize(filePath);
    if (fp.split(ctx.route.viewPath).length === 1) {
      throw new Error('Did`n have permissions');
    }
    return this.renderFile(filePath);
  }
}