import Service from "../base/Service";
import App from "../app";

export default class Session extends Service {

  static defaultOptions = {
    sessionKey: "$application",
    alphabet: "abcdefghijklmnopqrstuvwxyz-+|$%@#1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    provider: "MemorySession",
    autoStart: true
  };

  createSession(ctx) {
    const sessionKey = this.generateSessionKey();
    ctx.cookie.addCookie(this.getSessionKey(), sessionKey, {
      path: "/"
    });
    return sessionKey;
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  generateSessionKey() {
    let str = "";
    for (let i = 0; i < 32; i++) {
      str += this.alphabet[this.getRandomInt(0, this.alphabet.length - 1)];
    }
    return str;
  }

  getSessionKey() {
    return this.sessionKey;
  }

  initialize(ctx) {
    if (!this.autoStart) {
      return;
    }
    ctx.session = {};

    const session = App().getService(this.provider);

    const sessionKey = (ctx.cookie[this.getSessionKey()]) ?
      ctx.cookie[this.getSessionKey()] : this.createSession(ctx);

    ctx.session.set = function (key, value) {
      session.setValue(sessionKey, key, value);
    };

    ctx.session.get = function (key) {
      return session.getValue(sessionKey, key) || false;
    };

    ctx.session.clearSession = () => {
      session.remove(sessionKey);
      ctx.cookie.remove(this.getSessionKey());
    };
  }

}