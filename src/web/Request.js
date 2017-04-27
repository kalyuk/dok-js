import BaseRequest from "../base/Request";
import App from "../app";
export default class Request extends BaseRequest {

  init() {
    App().getService("Server").onRequest(this.run.bind(this));
  }
}