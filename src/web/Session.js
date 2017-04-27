import Service from "../base/Service";
import Hashids from "hashids";

export default class Session extends Service {

  static defaultOptions = {
    salt: "9idjdowjr8fj30dj39" + (new Date()).getTime(),
    sessionKey: "$application",
    alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    modelPath: null
  };

  init() {
    this.hashids = new Hashids(this.salt, 32, this.alphabet);
  }

  createSession(user) {
    return this.hashids.encode(user.id);
  }

  getSessionCookie(user) {
    return this.sessionKey + "=" + this.createSession(user) + "; Path=/; HttpOnly;";
  }

  clerSessionCookie() {
    return this.sessionKey + "=; Path=/; expires=" + Date.now(1) + ";"
  }

  async initSession(ctx) {
    const session = ctx.cookie[this.sessionKey];
    if (session) {
      const decode = this.hashids.decode(session);
      if (decode && decode.length) {
        const Model = require(this.modelPath).default;
        const user = await Model.find({where: {id: decode[0]}});
        if (user) {
          ctx.user = user;
        }
      }
    }
  }

}