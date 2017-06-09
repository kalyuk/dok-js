import {Controller} from '../../../console/Controller';
import {getApplication} from '../../../../index';
import fs from 'fs';
import path from 'path';
import {Migration} from '../models/Migration';

const MIGRATION_TEMPLATE = `export async function up(){
  return false;
}
export async function down(){
  return false;
}`;

export class IndexController extends Controller {
  /**
   * @database {DatabaseService}
   */

  $inject(DatabaseService) {
    this.database = DatabaseService;
  }

  createAction() {
    const name = getApplication().arguments.name || '';
    const time = (new Date()).getTime();
    const migrationPath = path.join(getApplication().getPath(), 'migrations', time + '' + name + '.js');

    fs.writeFileSync(migrationPath, MIGRATION_TEMPLATE);

    return this.render(200, `Created ${migrationPath}`);
  }

  async upAction() {
    try {
      await Migration.count();
    } catch (e) {
      await this.database.getInstance(this.module.config.databaseName).sync();
    }

    let migrations = await Migration.findAll();

    migrations = migrations.map(migrate => `${migrate.name}`);

    const migrationsPath = path.join(getApplication().getPath(), 'migrations');

    let files = fs.readdirSync(migrationsPath);
    let migrationsList = [];

    for (let q = 0; q < files.length; q++) {
      const file = files[q];

      if (migrations.indexOf(`${file}`) === -1) {
        migrationsList.push(`${file}`);
        const migration = require(path.join(migrationsPath, file));

        // eslint-disable-next-line
        if (await migration.up(this.database)) {
          await Migration.create({name: file});
        }
      }
    }

    if (!migrationsList.length) {
      return this.render(200, 'There are no new migrations');
    }

    return this.render(200, migrationsList.join('\n'));
  }

  async downAction() {
    const migrationsPath = path.join(getApplication().getPath(), 'migrations');

    const $migration = await Migration.find({order: 'id DESC'});

    const migration = require(path.join(migrationsPath, $migration.name));

    if (await migration.down(this.database)) {
      await $migration.destroy();
    }

    return this.render(200, `Migration ${$migration.name} down`);
  }
}