import {Module} from '../../base/Module';

export class MigrateModule extends Module {
  static options = {
    databaseName: 'db'
  };

  basePath = __dirname;

}