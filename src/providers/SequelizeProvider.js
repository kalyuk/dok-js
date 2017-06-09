import Sequelize from 'sequelize';

export class SequelizeProvider extends Sequelize {

  $models = {};

  defineModel(modelName, attributes, options, target) {
    if (!this.$models[modelName]) {

      if (!options.classMethods) {
        options.classMethods = {};
      }

      if (!options.instanceMethods) {
        options.instanceMethods = {};
      }

      Object.keys(target).forEach((proto) => {
        options.classMethods[proto] = target[proto];
      });

      // eslint-disable-next-line
      Object.keys(target.prototype).forEach(proto => {
        options.instanceMethods[proto] = target.prototype[proto];
      });
      delete options.schema;
      delete options.db;
      this.$models[modelName] = this.define(modelName, attributes, options);
    }
    return this.$models[modelName];
  }

}