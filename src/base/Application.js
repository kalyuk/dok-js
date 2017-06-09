import {Module} from './Module';
import {setApplication} from '../../index';
import * as _ from 'lodash';
import {LoggerService} from './LoggerService';
import {RouterService} from './RouterService';
import {DatabaseService} from './DatabaseService';
import {getFnParamNames} from '../helpers/fn';

export class Application extends Module {

  static options = {
    services: {
      DatabaseService: {
        func: DatabaseService
      },
      RouterService: {
        func: RouterService
      },
      LoggerService: {
        func: LoggerService
      }
    }
  };

  arguments = {
    env: 'development',
    port: 1987
  };

  constructor(configPath) {
    super({});
    setApplication(this);

    process.argv.forEach((val) => {
      const tmp = val.split('=');
      this.arguments[tmp[0]] = tmp[1];
    });

    const CONFIGURATIONS = require(configPath).default();

    this.config = _.defaultsDeep(CONFIGURATIONS.default, this.config);

    if (CONFIGURATIONS[this.arguments.env]) {
      this.config = _.defaultsDeep(CONFIGURATIONS[this.arguments.env], this.config);
    }
  }

  isDevMode() {
    return this.arguments.env === 'development';
  }

  get(type, name) {
    if (!this.config[type]) {
      throw new Error(`${type}, not resolve`);
    }

    if (!this.config[type][name]) {
      throw new Error(`${type}: ${name},  not resolve`);
    }

    if (!this.config[type][name].$instance) {

      if (!this.config[type][name].func) {
        if (!this.config[type][name].path) {
          throw new Error(`${type}: ${name},  undefined`);
        }

        const NAME = this.config[type][name].path.split('/').pop();
        this.config[type][name].func = require(this.config[type][name].path)[NAME];
      }

      const INSTANCE = this.config[type][name].func;
      this.config[type][name].$instance = new INSTANCE(this.config[type][name].options || {});
      const args = [];
      getFnParamNames(this.config[type][name].$instance.$inject).forEach(serviceName => {
        if (serviceName && serviceName.length) {
          args.push(this.getService(serviceName));
        }
      });
      this.config[type][name].$instance.$inject(...args);
      this.config[type][name].$instance.init();
    }

    return this.config[type][name].$instance;
  }

  getService(name) {
    return this.get('services', name);
  }

  getModule(name) {
    if (name === this.getId()) {
      return this;
    }
    return this.get('modules', name);
  }

  log(type, ...args) {
    this.getService('LoggerService').render(type, ...args);
  }

  runRoute(ctx) {
    this.getService('RouterService').matchRoute(ctx);
    const module = this.getModule(ctx.route.moduleName || this.getId());
    return module.runAction(ctx);
  }
}
