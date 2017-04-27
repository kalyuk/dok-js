import Service from "./Service";
import App from "../app";
import {LogLevelEnum} from "./Application";

export default class ErrorHandler extends Service {
  handle(code, message) {
    const content = App().isDevMode() && code >= 500
    || (code < 500) ? message : "Disaster struck";

    App().log(LogLevelEnum.ERROR, message);

    return {
      body: {
        code,
        error: content
      },
      state: code
    };
  }
}