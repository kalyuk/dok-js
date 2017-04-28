import Service from "../base/Service";
import * as http from "http";
import {LogLevelEnum} from "../base/Application";
import App from "../app";

const EVENT = {
  close: "close",
  request: "request"
};

export default class Server extends Service {

  static defaultOptions = {
    host: "0.0.0.0",
    port: "3000",
    maxPostBodyLen: 1e6
  };

  /**
   * @type {http.Server}
   * @private
   */
  __server = null;

  init() {
    this.__server = http.createServer();
    this.__server.timeout = this.timeout;
  }

  /**
   * @return {Promise.<Server>}
   */
  async listen() {
    return new Promise((resolve) => {
      this.__server.listen(this.port, this.host, () => {
        const message = `==> Listening on port ${this.port}. 
Open up http://${this.host}:${this.port}/ in your browser.`;

        App().log(LogLevelEnum.INFO, message);
        resolve(this);
      });
    });
  }

  onCloseRequest(callback) {
    this.__server.on(EVENT[EVENT.close], callback);
  }

  onRequest(callback) {
    this.__server.on(EVENT[EVENT.request], async (request, response) => {
      const ctx = {
        url: request.url,
        headers: request.headers,
        method: request.method
      };

      if (request.method === "POST" || request.method === "PUT") {
        ctx.body = "";
        request.on("data", (data) => {
          ctx.body += data;
          if (ctx.body.length > this.maxPostBodyLen) {
            request.connection.destroy();
          }
        });
        request.on("end", () => {
          this.run(ctx, callback, response);
        });
      } else {
        this.run(ctx, callback, response);
      }
    });
  }

  async run(ctx, callback, response) {
    const Session = App().getService("Session");
    const Response = App().getService("Response");
    const Cookie = App().getService("Cookie");
    Cookie.initialize(ctx);
    Session.initialize(ctx);
    const result = await callback(ctx);
    Response.render(ctx, result, response);
  }
}