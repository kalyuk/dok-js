import SequelizeModule from "sequelize";
import Service from "./Service";

export default class Sequelize extends Service {
  createInstance(config) {
    return new SequelizeModule(
      config.database,
      config.username,
      config.password,
      config.params);
  }

  associate(instances) {
    Object.keys(instances).forEach(modelName => {
      if (instances[modelName].associate) {
        instances[modelName].associate(instances);
      }
    });
  }

  defineModel(instance, modelName, attributes, options) {
    return instance.define(modelName, attributes, options);
    /* if (options.associate) {
     options.associate(model);
     }*/
    // return model;
  }

}