import Service from "./Service";
import App from "../app";
import query from "querystring";
import {LogLevelEnum as LogLevel} from "./Application";

export default class Request extends Service {
  static types = {
    json: "application/json",
    urlencoded: "application/x-www-form-urlencoded"
  };

  static parse(ctx) {
    const $query = ctx.url.split("?");
    if ($query.length > 1) {
      ctx.query = query.parse($query[1]);
    }

    if (ctx.body && ctx.headers["content-type"]) {
      try {
        switch (ctx.headers["content-type"]) {
          case Request.types.json:
            ctx.body = JSON.parse(ctx.body);
            break;
          case Request.types.urlencoded:
            ctx.body = query.parse(ctx.body);
            break;
          default:
        }
      } catch (e) {
        App().log(LogLevel.ERROR, e);
      }
    }
  }

  async run(ctx) {
    this.constructor.parse(ctx);
    try {
      ctx.route = App().getService("Router").getRoute(ctx.method, ctx.url);
    } catch (e) {
      return App().getService("ErrorHandler").handle(404, e.message);
    }

    try {
      return App().getModule(ctx.route.moduleName).runAction(ctx);
    } catch (e) {
      return App().getService("ErrorHandler").handle(500, e.message);
    }
  }

}