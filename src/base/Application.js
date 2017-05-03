/**
 * @type {{DEBUG: number, INFO: number, WARNING: number, ERROR: number, RENDER: number}}
 * @enum {string}
 */
import _ from "lodash";
import Module from "./Module";
import path from "path";
import Storage from "./Storage";
import Router from "./Router";
import ErrorHandler from "./ErrorHandler";
import Database from "./Database";
import Sequelize from "./Sequelize";
import Security from "./Security";

export const LogLevelEnum = {
  DEBUG: 0,
  INFO: 1,
  WARNING: 2,
  ERROR: 3,
  RENDER: 5
};

export default class Application extends Module {
  args = {
    env: "development"
  };

  $cache = {};

  constructor(config) {
    super(config);
    global.$App = this;
    this.$cache.modules = {};
  }

  defineModel(modelName, attributes, options = {}) {
    return this.getService("Database").defineModel(modelName, attributes, options);
  }

  init() {
    this.$cache.modules[this.id] = this;
    this.parseArgs();
    this.loadConfig();
    this.register("services", "Security", {instance: Security});
    this.register("services", "ErrorHandler", {instance: ErrorHandler});
    this.register("services", "Storage", {instance: Storage});
    this.register("services", "Router", {instance: Router});
    this.register("services", "Sequelize", {instance: Sequelize});
    this.register("services", "Database", {instance: Database});
    super.init();
  }

  register(type, name, config) {
    if (!this.$cache[type]) {
      this.$cache[type] = {};
    }

    if (config.path || config.instance) {
      if (config.path) {
        config.instance = require(config.path).default;
      }
      const Instance = config.instance;

      let c = Object.assign(Instance.defaultOptions, config.options || {});
      c = Object.assign(c, this[type] && this[type][name] && this[type][name].options || {});
      this.$cache[type][name] = new Instance(c);
      this.$cache[type][name].init();
    } else {
      throw new Error(`"${name}" did not resolve`);
    }
  }

  getModulesName() {
    return Object.keys(this.modules);
  }

  getComponent(type, name) {
    if (this.$cache[type] && this.$cache[type][name]) {
      return this.$cache[type][name];
    } else if (this[type][name]) {
      this.register(type, name, this[type][name] || {});
      return this.$cache[type][name];
    }
    throw new Error(`"${name}" not registered`);
  }

  loadConfig() {
    const configPath = path.join(this.getBasePath(), "config", this.id + ".js");
    const configAll = require(configPath).default();

    let config = _.defaultsDeep(configAll.default, {});
    if (configAll[this.args.env]) {
      config = _.defaultsDeep(configAll[this.args.env], config);
    }

    Object.keys(config).forEach(key => {
      this[key] = config[key];
    });
  }

  /**
   * @param {string} name
   * @return {Function}
   */
  getService(name) {
    return this.getComponent("services", name);
  }

  /**
   * @param {string} name
   * @return {Function}
   */
  getBehavior(name) {
    return this.getComponent("behaviors", name);
  }

  /**
   * @param {string} name
   * @return {Function}
   */
  getModule(name) {
    return this.getComponent("modules", name);
  }

  /**
   * Is development mode
   * @return {boolean}
   */
  isDevMode() {
    return this.args.env === "development";
  }

  /**
   * @param {number} type LogLevel warning
   * @param {array} args list of arguments
   * @return {void}
   */
  log(type, ...args) {
    if (this.isDevMode() || this.logLevel >= type) {
      console.log.apply(console, args); // eslint-disable-line
    }
  }

  parseArgs() {
    process.argv.forEach((val) => {
      const tmp = val.split("=");
      this.args[tmp[0]] = tmp[1];
    });
  }

  run() {
    this.init();
  }
}