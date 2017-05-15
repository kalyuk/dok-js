import Service from "../base/Service";
import cookie from "cookie";

export default class Cookie extends Service {
  initialize(ctx) {

    ctx.cookie = {};
    if (ctx.headers.cookie) {
      ctx.cookie = cookie.parse(ctx.headers.cookie);
    }

    ctx.cookie.__ = {
      new: [],
      remove: []
    };

    ctx.cookie.addCookie = function (name, value, options) {
      ctx.cookie.__.new.push(cookie.serialize(name, value, options));
    };

    ctx.cookie.remove = function (name) {
      ctx.cookie.__.remove.push(name + "=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT");
    };
  }
}