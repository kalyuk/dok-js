import _ from 'lodash';
import {getApplication} from '../../index';

export class Component {
  static options = {};

  constructor(config = {}) {
    this.config = _.defaultsDeep(config, this.deepConfig(this.constructor));
  }

  $inject() {

  }

  init() {
    getApplication().log(0, `Component ${this.className()} initialize`);
  }

  className() {
    return this.constructor.name;
  }

  deepConfig(constructor) {
    let config = {...constructor.options} || {};
    // eslint-disable-next-line
    if (constructor.__proto__.name) {
      // eslint-disable-next-line
      config = _.defaultsDeep(config, this.deepConfig(constructor.__proto__));
    }
    return config;
  }
}