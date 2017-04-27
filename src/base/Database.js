import Service from "./Service";
import App from "../app";
import path from "path";
import * as fs from "fs";

export default class Database extends Service {

  static defaultOptions = {
    instances: {}
  };

  $cache = {};

  init() {
    Object.keys(this.instances).forEach(instanceName => {
      const config = this.instances[instanceName];
      this.$cache[instanceName] = {
        instance: this.getProviderByName(instanceName).createInstance(config)
      };
    });

    App().getModulesName().forEach(moduleName => {
      const module = App().getModule(moduleName);
      const modelsPath = path.join(module.getBasePath(), "models");
      if (fs.existsSync(modelsPath)) {
        fs.readdirSync(modelsPath).forEach(file => {
          require(path.join(modelsPath, file));
        });
      }
    });

    Object.keys(this.$cache).forEach(instanceName => {
      this.getProviderByName(instanceName).associate(this.$cache[instanceName]);
    });
  }

  getProviderByName(instanceName) {
    const config = this.instances[instanceName];
    const providerName = config.provider ? config.provider : "Sequelize";
    return App().getService(providerName);
  }

  defineModel(modelName, attributes, options = {}) {
    const instanceName = options.$db ? options.$db : Object.keys(this.instances)[0];
    const instance = this.$cache[instanceName].instance;
    if (!this.$cache[instanceName][modelName]) {
      const provider = this.getProviderByName(instanceName);
      this.$cache[instanceName][modelName] = provider.defineModel(instance, modelName, attributes, options)
    }
    return this.$cache[instanceName][modelName];
  }

  getInstance(instanceName) {
    return this.$cache[instanceName].instance;
  }

}