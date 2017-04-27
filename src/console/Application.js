import BaseApplication from "../base/Application";
import MigrationModule from "../modules/migration/MigrationModule";
import Request from "../base/Request";
import Response from "./Response";

export default class Application extends BaseApplication {
  preInit() {
    this.register("services", "Request", {instance: Request});
    this.register("services", "Response", {instance: Response});
    this.register("modules", "migration", {instance: MigrationModule});
  }

  init() {
    super.init();
    const ctx = {
      url: this.args.route,
      headers: {},
      method: "COMMAND"
    };
    this.getService("Request").run(ctx).then(result => {
      this.getService("Response").render(result);
    });
  }
}