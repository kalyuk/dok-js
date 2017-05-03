import Service from "./Service";

export default class Storage extends Service {

  static defaultOptions = {
    instances: {}
  };

  $cache = {};

  getInstance(name) {
    if (!this.$cache[name]) {
      if (!this.instances[name] || !this.instances[name].path) {
        throw new Error(`${name} not found`);
      }
      const Instance = require(this.instances[name].path).default;
      this.$cache[name] = new Instance(this.instances[name].options);
    }
    return this.$cache[name];
  }

}