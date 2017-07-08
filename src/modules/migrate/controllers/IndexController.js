import {ConsoleController} from '../../../console/ConsoleController';
import {getApplication} from '../../../index';
import * as path from 'path';
import * as fs from 'fs';
import Migration from '../models/Migration';

const MIGRATION_TEMPLATE = `export async function up(){
  return false;
}
export async function down(){
  return false;
}`;

export class IndexController extends ConsoleController {

  constructor(databaseService) {
    super();
    this.databaseService = databaseService;
  }

  createAction() {
    const name = getApplication().arguments.name || '';
    const time = (new Date()).getTime();

    // eslint-disable-next-line
    const migrationPath = path.join(this.$module.getMigrationPath(), time + '' + name + this.$module.config.controller.ext);

    fs.writeFileSync(migrationPath, MIGRATION_TEMPLATE);

    return this.render(200, `Created ${migrationPath}`);
  }

  async upAction() {
    try {
      await Migration.count();
    } catch (e) {
      await this.databaseService.getInstance(this.$module.config.databaseName).sync();
    }

    let migrations = await Migration.findAll();

    migrations = migrations.map((migrate) => `${migrate.name}`);

    const files = fs.readdirSync(this.$module.getMigrationPath());
    const migrationsList = [];

    for (let q = 0; q < files.length; q++) {
      const file = files[q];

      if (migrations.indexOf(`${file}`) === -1) {
        migrationsList.push(`${file}`);
        const migration = require(path.join(this.$module.getMigrationPath(), file));

        if (await migration.up(this.databaseService)
        ) {
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
    const $migration = await Migration.find({order: [['id', 'DESC']]});
    const migration = require(path.join(this.$module.getMigrationPath(), $migration.name));

    if (await migration.down(this.databaseService)) {
      await $migration.destroy();
    }

    return this.render(200, `Migration ${$migration.name} down`);
  }
}
