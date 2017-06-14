import {Component} from './Component';
import * as path from 'path';
import * as fs from 'fs';
import {ucFirst} from '../helpers/string';
import {getFnParamNames} from '../helpers/fn';
import {getApplication} from '../../index';

export class Module extends Component {
  static options = {
    controller: {
      dirName: 'controllers',
      ext: '.js'
    }
  };

  basePath = '';
  controllers = {};

  getId() {
    return this.config.id || this.id || this.className().replace('Module', '').toLowerCase();
  }

  getPath() {
    return this.config.basePath || this.basePath || '';
  }

  getControllerPath(controllerName) {
    return path.join(
      this.getPath(),
      this.config.controller.dirName,
      controllerName + this.config.controller.ext);
  }

  getController(controllerName) {
    if (!this.controllers[controllerName]) {
      const fullControllerName = ucFirst(controllerName) + 'Controller';
      const controllerPath = this.getControllerPath(fullControllerName);
      if (fs.existsSync(controllerPath)) {
        this.controllers[controllerName] = new (require(controllerPath)[fullControllerName])();
        this.controllers[controllerName].init(this);
        const args = [];
        getFnParamNames(this.controllers[controllerName].$inject).forEach(serviceName => {
          if (serviceName && serviceName.length) {
            args.push(getApplication().getService(serviceName));
          }
        });
        this.controllers[controllerName].$inject(...args);
      } else {
        throw new Error(`Controller ${controllerName} in ${this.getId()} not found`);
      }
    }

    return this.controllers[controllerName];
  }

  async runBehaviors(controller, ctx) {
    const behaviors = controller.getBehaviors();
    let result = false;
    for (let i = 0; i < behaviors.length; i++) {
      if (result) {
        i = behaviors.length;
        continue;
      }

      if (!behaviors[i].actions || behaviors[i].actions.indexOf(ctx.route.actionName) !== -1) {
        result = await behaviors[i].behavior(ctx, behaviors[i]);
      }
    }
    return result;
  }

  async runAction(ctx) {
    const controller = this.getController(ctx.route.controllerName);
    if (!controller[ctx.route.actionName + 'Action']) {
      throw new Error(`Method ${ctx.route.actionName}Action in controller '${ctx.route.controllerName}' not found`);
    }

    const result = await this.runBehaviors(controller, ctx);

    if (result) {
      return result;
    }

    return controller[ctx.route.actionName + 'Action'](ctx);
  }
}