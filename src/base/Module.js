import path from "path";
import fs from "fs";
import Component from "./Component";
import {ucFirst} from "../helpers/string";

export default class Module extends Component {
  __controllers = {};

  init() {
    if (!this.id) {
      this.id = this.className().replace("Module", "").toLowerCase();
    }
    super.init();
  }

  /**
   * @param {string} controllerName
   * @return {Controller}
   */
  createController(controllerName) {
    if (!this.__controllers[controllerName]) {
      const controllerPath = this.getControllerPath(controllerName);
      if (fs.existsSync(controllerPath)) {
        this.__controllers[controllerName] = new (require(controllerPath).default)(this.getViewPath());
        return this.__controllers[controllerName];
      }
      throw new Error(`Controller "${controllerName}" in module "${this.constructor.name}" not found`);
    }
    return this.__controllers[controllerName];
  }

  /**
   * @return {String}
   */
  getBasePath() {
    return this.basePath;
  }

  /**
   * @param {string} controllerName
   * @return {string}
   */
  getControllerPath(controllerName) {
    return path.join(this.getBasePath(), "controllers", `${ucFirst(controllerName)}Controller.js`);
  }

  /**
   * @return {string}
   */
  getViewPath() {
    if (!this.viewPath) {
      return path.join(this.getBasePath(), "views");
    }

    return this.viewPath;
  }

  async runBehaviors(ctx, controller) {
    const behaviors = controller.getBehaviors(ctx);
    for (let i = 0; i < behaviors.length; i++) {
      const behavior = await behaviors[i].behavior(ctx, behaviors[i].options);
      if (behavior) {
        return behavior;
      }
    }
    return false;
  }

  async runAction(ctx) {
    const {controllerName, actionName} = ctx.route;
    const controller = this.createController(controllerName);
    if (!controller[actionName]) {
      throw new Error(`Action "${actionName}" in controller "${controllerName}" not found`);
    }

    const result = await this.runBehaviors(ctx, controller);
    if (result) {
      return result;
    }
    return controller[actionName](ctx);
  }
}
