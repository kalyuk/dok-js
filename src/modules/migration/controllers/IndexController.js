import fs from "fs";
import path from "path";
import Controller from "../../../console/Controller";
import MigrationModel from "../models/MigrationModel";
import App from "../../../app";

const MIGRATION_TEMPLATE = `export async function up(Database){
  return false;
}
export async function down(Database){
  return false;
}`;

export default class IndexController extends Controller {
  createAction() {
    const name = App().args.name ? "_" + App().args.name : "";
    const time = (new Date()).getTime();
    const migrationPath = path.join(App().getBasePath(), "migrations", time + name + ".js");
    fs.writeFileSync(migrationPath, MIGRATION_TEMPLATE);
    return this.render(`Created ${migrationPath}`);
  }

  async upAction() {
    const migrationsList = [];
    const Database = App().getService("Database");
    try {
      await MigrationModel.count();
    } catch (e) {
      await Database.getInstance("db").sync();
    }

    let migrations = await MigrationModel.findAll();

    migrations = migrations.map(migrate => `${migrate.name}`);

    const migrationsPath = path.join(App().getBasePath(), "migrations");

    let files = fs.readdirSync(migrationsPath);

    for (let q = 0; q < files.length; q++) {
      const file = files[q];

      if (migrations.indexOf(`${file}`) === -1) {
        migrationsList.push(`${file}`);
        const migration = require(path.join(migrationsPath, file));

        // eslint-disable-next-line
        if (await migration.up(Database)) {
          await MigrationModel.create({name: file});
        }
      }
    }

    return this.render(migrationsList.join("\n"));
  }

  async downAction() {
    const Database = App().getService("Database");
    const migrationsPath = path.join(App().getBasePath(), "migrations");

    const $migration = await MigrationModel.find({order: "id DESC"});

    const migration = require(path.join(migrationsPath, $migration.name));

    if (await migration.down(Database)) {
      await $migration.destroy();
    }

    return this.render(`Migration ${$migration.name} down`);
  }
}