import BaseApplication from "../base/Application";
import Server from "./Server";
import Request from "./Request";
import Response from "./Response";
import Session from "./Session";
import Cookie from "./Cookie";
import StaticModule from "../modules/static/StaticModule";

export default class Application extends BaseApplication {
  preInit() {
    this.register("modules", "static", {instance: StaticModule});
    this.register("services", "Cookie", {instance: Cookie});
    this.register("services", "Session", {instance: Session});
    this.register("services", "Response", {instance: Response});
    this.register("services", "Server", {instance: Server});
    this.register("services", "Request", {instance: Request});
  }

  init() {
    super.init();
    this.getService("Server").listen();
  }
}