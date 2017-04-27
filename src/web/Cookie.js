import Service from "../base/Service";
import cookie from "cookie";
export default class Cookie extends Service {
  parse(ctx) {
    ctx.cookie = {};
    if (ctx.headers.cookie) {
      ctx.cookie = cookie.parse(ctx.headers.cookie);
    }
  }
}