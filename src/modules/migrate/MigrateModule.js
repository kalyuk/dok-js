import {Module} from '../../base/Module';
import * as path from 'path';
import {getApplication} from '../../index';

export class MigrateModule extends Module {
  static options = {
    databaseName: 'db',
    migrationDirName: 'migrations'
  };

  $basePath = __dirname;

  getMigrationPath() {
    return path.join(getApplication().getPath(), this.config.migrationDirName);
  }
}