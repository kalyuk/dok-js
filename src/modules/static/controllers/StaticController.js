import Controller from "dok-js/dist/web/Controller";
import * as path from "path";

export default class StaticController extends Controller {
  indexAction(ctx) {
    const filePath = path.join(ctx.route.viewPath, ctx.route.filePath.split("?")[0]);
    const fp = path.normalize(filePath);
    if (fp.split(ctx.route.viewPath).length === 1) {
      throw new Error("Did`n have permissions");
    }
    return this.renderFile(filePath);
  }
}