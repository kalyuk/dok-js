import _ from "lodash";
import App from "../app";
import BaseResponse from "../base/Response";
import {LogLevelEnum as LogLevel} from "../base/Application";

export default class Response extends BaseResponse {
  render(content) {
    const result = _.defaultsDeep(content, this.config);

    const data = Response.getContent(result.body);

    App().log(LogLevel.RENDER, data);
  }
}