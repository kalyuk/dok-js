import {Service} from '../base/Service';
import {Sequelize} from 'sequelize';

export class DatabaseService extends Service {
  _instances = {};

  init() {
    super.init();
    Object.keys(this.config.instances).forEach((instanceName) => {
      switch (this.config.instances[instanceName].provider) {
        default:
          this._instances[instanceName] = new Sequelize(
            this.config.instances[instanceName].database,
            this.config.instances[instanceName].username,
            this.config.instances[instanceName].password,
            this.config.instances[instanceName].params);
      }
    });
  }

  getInstance(instanceName) {
    return this._instances[instanceName];
  }
}