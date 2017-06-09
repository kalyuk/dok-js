import Sequelize from 'sequelize';
import * as _ from 'lodash';

export class SequelizeProvider extends Sequelize {

  $models = {};

  defineModel(modelName, attributes, options, target) {
    if (!this.$models[modelName]) {
      this.$models[modelName] = this.define(modelName, attributes, options);
      this.$models[modelName] = _.defaultsDeep(this.$models[modelName], target);
    }
    return this.$models[modelName];
  }

}