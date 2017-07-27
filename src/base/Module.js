import {Component} from './Component';
import path from 'path';
import fs from 'fs';
import {ucFirst} from '../helpers/string';
import {inject} from '../helpers/inject';
import {CoreError} from './CoreError';

export class Module extends Component {
  static options = {
    controller: {
      dirName: 'controllers',
      ext: '.js'
    }
  };

  $id = '';
  $basePath = '';
  $controllers = {};

  getId() {
    return this.config.id || this.$id || this.constructor.name.replace('Module', '').toLowerCase();
  }

  getPath() {
    return this.config.basePath || this.$basePath || '';
  }

  $getControllerPath(controllerName) {
    return path.join(
      this.getPath(),
      this.config.controller.dirName,
      controllerName + this.config.controller.ext);
  }

  $getController(controllerName) {
    if (!this.$controllers[controllerName]) {
      const fullControllerName = ucFirst(controllerName) + 'Controller';
      const controllerPath = this.$getControllerPath(fullControllerName);
      if (fs.existsSync(controllerPath)) {
        const INSTANCE = (require(controllerPath)[fullControllerName]);

        const args = inject(INSTANCE);

        this.$controllers[controllerName] = new INSTANCE(...args);
        this.$controllers[controllerName].init(this, controllerName);

      } else {
        throw new CoreError(500, `Controller ${controllerName} in ${this.getId()} not found`);
      }
    }
    return this.$controllers[controllerName];
  }

  async $runBehaviors(ctx, controller) {
    const behaviors = controller.getBehaviors();
    for (let i = 0; i < behaviors.length; i++) {
      const behavior = behaviors[i];
      if (!behavior.actions || behavior.actions.indexOf(ctx.route.actionName) !== -1) {
        await behavior.behavior(ctx, behavior.options);
      }
    }
  }

  async runAction(ctx) {
    const controller = this.$getController(ctx.route.controllerName);
    if (!controller[ctx.route.actionName + 'Action']) {
      // eslint-disable-next-line
      throw new CoreError(500, `Method ${ctx.route.actionName}Action in controller '${ctx.route.controllerName}' not found`);
    }

    await this.$runBehaviors(ctx, controller);

    return controller[ctx.route.actionName + 'Action'](ctx);
  }
}