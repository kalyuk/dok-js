import {defaultsDeep} from 'lodash';

export class Component {
  static options = {};

  init() {

  }

  $configure(config) {
    this.config = defaultsDeep(config, this.config, this._deepDefaultConfig(this.constructor));
  }

  _deepDefaultConfig(constructor) {
    let config = {...constructor.options} || {};
    if (constructor.__proto__.name) {
      config = defaultsDeep(config, this._deepDefaultConfig(constructor.__proto__));
    }
    return config;
  }
}