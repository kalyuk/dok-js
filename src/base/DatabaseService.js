import {Service} from './Service';
import {SequelizeProvider} from '../providers/SequelizeProvider';

export class DatabaseService extends Service {

  instances = {};

  init() {
    super.init();
    Object.keys(this.config.instances).forEach((instanceName) => {
      switch (this.config.instances[instanceName].provider) {
        default:
          this.instances[instanceName] = new SequelizeProvider(
            this.config.instances[instanceName].database,
            this.config.instances[instanceName].username,
            this.config.instances[instanceName].password,
            this.config.instances[instanceName].params);
      }
    });
  }

  getInstance(instanceName) {
    return this.instances[instanceName];
  }

}