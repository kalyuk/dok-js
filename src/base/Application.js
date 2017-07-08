import {Module} from './Module';
import {defaultsDeep} from 'lodash';
import {CoreError} from './CoreError';
import {RouteService} from '../service/RouteService';
import {setApplication} from '../index';
import {LoggerService} from '../service/LoggerService';
import {inject} from '../helpers/inject';
import {DatabaseService} from '../service/DatabaseService';
// import {SecurityService} from '../services/SecurityService';
// import {JwtService} from '../services/JwtService';*/

export class Application extends Module {
  static options = {
    services: {
      DatabaseService: {
        func: DatabaseService
      },
      LoggerService: {
        func: LoggerService
      },
      RouteService: {
        func: RouteService
      }
    }
  };

  config = {};

  arguments = {
    env: 'development',
    port: 1987
  };

  constructor(configPath) {
    super();
    setApplication(this);

    process.argv.forEach((val) => {
      const tmp = val.split('=');
      this.arguments[tmp[0]] = tmp[1];
    });

    const configurations = require(configPath).default();

    const config = defaultsDeep(configurations[this.arguments.env] || {}, configurations.default);

    this.$configure(config);
  }

  get(type, name) {
    if (!this.config[type]) {
      throw new CoreError(500, `${type}, not resolve`);
    }

    if (!this.config[type][name]) {
      throw new CoreError(500, `${type}: ${name},  not resolve`);
    }

    if (!this.config[type][name].$instance) {
      if (!this.config[type][name].func) {
        if (!this.config[type][name].path) {
          throw new CoreError(500, `${type}: ${name},  undefined`);
        }

        const NAME = this.config[type][name].path.split('/').pop();
        this.config[type][name].func = require(this.config[type][name].path)[NAME];
      }

      const INSTANCE = this.config[type][name].func;

      const args = inject(INSTANCE);

      this.config[type][name].$instance = new INSTANCE(...args);

      this.config[type][name].$instance.$configure(this.config[type][name].options || {});
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

  runRoute(ctx) {
    this.getService('RouteService').matchRoute(ctx);
    return this.getModule(ctx.route.moduleName || this.getId()).runAction(ctx);
  }
}